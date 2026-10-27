-- Checkpoint Reading: database setup for Supabase.
-- Paste this whole file into Supabase > SQL Editor > New query, and click Run. Safe to run again.
-- The website never reads tables directly: every request goes through the ck_* functions below,
-- which check the student's sign-in token first. Tables are locked to the public (anon) key.

create extension if not exists pgcrypto with schema extensions;

create table if not exists ck_students (
  id            uuid primary key default gen_random_uuid(),
  class_code    text not null,
  username      text not null unique,
  display_name  text not null,
  pin_hash      text not null,
  role          text not null default 'student' check (role in ('student', 'teacher')),
  level         smallint check (level between 0 and 2),
  xp_total      integer not null default 0,
  failed_logins integer not null default 0,
  locked_until  timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists ck_tokens (
  token      uuid primary key default gen_random_uuid(),
  student_id uuid not null references ck_students(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '120 days'
);

create table if not exists ck_attempts (
  id          bigint generated always as identity primary key,
  student_id  uuid not null references ck_students(id) on delete cascade,
  mode        text not null check (mode in ('baseline', 'practice')),
  text_id     text not null,
  level_start smallint,
  level_end   smallint,
  score       integer not null default 0,
  max_score   integer not null default 0,
  xp          integer not null default 0,
  seconds     integer,
  answers     jsonb not null default '[]',
  created_at  timestamptz not null default now()
);
create index if not exists ck_attempts_student on ck_attempts(student_id, created_at);
-- Activity types: reading baseline, reading practice, vocabulary and grammar practice, listening.
alter table ck_attempts drop constraint if exists ck_attempts_mode_check;
alter table ck_attempts add constraint ck_attempts_mode_check
  check (mode in ('baseline', 'practice', 'vocab', 'grammar', 'listening'));

alter table ck_students enable row level security;
alter table ck_tokens   enable row level security;
alter table ck_attempts enable row level security;
revoke all on ck_students, ck_tokens, ck_attempts from anon, authenticated;

-- Monday 00:00 of the current week, school time (Vietnam, UTC+7).
create or replace function ck_week_start() returns timestamptz
language sql stable as $$
  select date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh'
$$;

-- Look up the signed-in student from a token, or stop with a friendly error.
create or replace function ck_auth(p_token uuid) returns ck_students
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students;
begin
  select st.* into s from ck_tokens t join ck_students st on st.id = t.student_id
   where t.token = p_token and t.expires_at > now();
  if s.id is null then raise exception 'Please sign in again.'; end if;
  return s;
end $$;

create or replace function ck_login(p_username text, p_pin text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students; tok uuid;
begin
  select * into s from ck_students where username = lower(trim(p_username));
  -- Errors here are returned, not raised, so the failed-try counter is saved.
  if s.id is null then return json_build_object('error', 'Wrong username or PIN.'); end if;
  if s.locked_until is not null and s.locked_until > now() then
    return json_build_object('error', 'Too many wrong tries. Wait 5 minutes, then try again.');
  end if;
  if s.pin_hash <> crypt(trim(p_pin), s.pin_hash) then
    update ck_students
       set failed_logins = case when failed_logins + 1 >= 5 then 0 else failed_logins + 1 end,
           locked_until  = case when failed_logins + 1 >= 5 then now() + interval '5 minutes' else locked_until end
     where id = s.id;
    return json_build_object('error', 'Wrong username or PIN.');
  end if;
  update ck_students set failed_logins = 0, locked_until = null where id = s.id;
  delete from ck_tokens where student_id = s.id and expires_at < now();
  insert into ck_tokens(student_id) values (s.id) returning token into tok;
  return json_build_object('token', tok, 'role', s.role, 'name', s.display_name,
                           'class_code', s.class_code, 'level', s.level);
end $$;

create or replace function ck_logout(p_token uuid) returns void
language sql security definer set search_path = public as $$
  delete from ck_tokens where token = p_token
$$;

create or replace function ck_me(p_token uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token);
begin
  return json_build_object(
    'id', s.id, 'name', s.display_name, 'username', s.username, 'class_code', s.class_code,
    'role', s.role, 'level', s.level, 'xp_total', s.xp_total,
    'xp_week', (select coalesce(sum(xp), 0) from ck_attempts where student_id = s.id and created_at >= ck_week_start()),
    'baseline_done', exists(select 1 from ck_attempts where student_id = s.id and mode = 'baseline'));
end $$;

create or replace function ck_history(p_token uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token);
begin
  return coalesce((select json_agg(a order by a.created_at) from (
    select id, mode, text_id, level_start, level_end, score, max_score, xp, seconds, answers, created_at
      from ck_attempts where student_id = s.id) a), '[]'::json);
end $$;

create or replace function ck_save_attempt(p_token uuid, p_attempt jsonb) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token); v_xp integer; v_level smallint;
begin
  if s.role <> 'student' then raise exception 'Only students can save attempts.'; end if;
  if (p_attempt->>'mode') not in ('baseline', 'practice', 'vocab', 'grammar', 'listening') then raise exception 'Unknown attempt type.'; end if;
  v_xp := least(greatest(coalesce((p_attempt->>'xp')::int, 0), 0), 400);
  -- Only reading changes the reading level; vocabulary and grammar keep it as it is.
  v_level := case when (p_attempt->>'mode') in ('baseline', 'practice')
                  then least(greatest((p_attempt->>'level_end')::int, 0), 2) else s.level end;
  insert into ck_attempts(student_id, mode, text_id, level_start, level_end, score, max_score, xp, seconds, answers)
  values (s.id, p_attempt->>'mode', left(coalesce(p_attempt->>'text_id', ''), 60),
          (p_attempt->>'level_start')::smallint,
          case when (p_attempt->>'mode') in ('baseline', 'practice') then v_level end,
          coalesce((p_attempt->>'score')::int, 0), coalesce((p_attempt->>'max_score')::int, 0),
          v_xp, least(coalesce((p_attempt->>'seconds')::int, 0), 36000),
          coalesce(p_attempt->'answers', '[]'::jsonb));
  update ck_students set xp_total = xp_total + v_xp, level = v_level where id = s.id
  returning xp_total, level into s.xp_total, s.level;
  return json_build_object('xp_total', s.xp_total, 'level', s.level);
end $$;

-- Class leaderboards: XP this week, XP all time, and most improved (first vs latest baseline).
create or replace function ck_leaderboard(p_token uuid, p_class text default null) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token); v_class text;
begin
  v_class := case when s.role = 'teacher' and p_class is not null then p_class else s.class_code end;
  return json_build_object(
    'class_code', v_class,
    'week', coalesce((select json_agg(r order by r.xp desc, r.name) from (
        select st.display_name as name, st.id = s.id as me, coalesce(sum(a.xp), 0)::int as xp
          from ck_students st left join ck_attempts a on a.student_id = st.id and a.created_at >= ck_week_start()
         where st.class_code = v_class and st.role = 'student'
         group by st.id) r), '[]'::json),
    'all', coalesce((select json_agg(r order by r.xp desc, r.name) from (
        select display_name as name, id = s.id as me, xp_total as xp
          from ck_students where class_code = v_class and role = 'student') r), '[]'::json),
    'improved', coalesce((select json_agg(r order by r.gain desc, r.name) from (
        select st.display_name as name, st.id = s.id as me,
               (array_agg(a.score order by a.created_at desc))[1] - (array_agg(a.score order by a.created_at))[1] as gain
          from ck_students st join ck_attempts a on a.student_id = st.id and a.mode = 'baseline'
         where st.class_code = v_class and st.role = 'student'
         group by st.id having count(*) >= 2) r), '[]'::json));
end $$;

/* ---------------- teacher ---------------- */
create or replace function ck_require_teacher(p_token uuid) returns ck_students
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token);
begin
  if s.role <> 'teacher' then raise exception 'Teacher sign-in needed.'; end if;
  return s;
end $$;

create or replace function ck_teacher_classes(p_token uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  return coalesce((select json_agg(c order by c) from (
    select distinct class_code as c from ck_students where role = 'student') x), '[]'::json);
end $$;

create or replace function ck_teacher_class(p_token uuid, p_class text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  return coalesce((select json_agg(r order by r.username) from (
    select st.id, st.display_name as name, st.username, st.level, st.xp_total,
      (select coalesce(sum(xp), 0) from ck_attempts a where a.student_id = st.id and a.created_at >= ck_week_start())::int as xp_week,
      (select count(*) from ck_attempts a where a.student_id = st.id and a.mode = 'practice')::int as texts_done,
      (select score from ck_attempts a where a.student_id = st.id and a.mode = 'baseline' order by created_at limit 1) as baseline_first,
      (select score from ck_attempts a where a.student_id = st.id and a.mode = 'baseline' order by created_at desc limit 1) as baseline_latest,
      (select max(created_at) from ck_attempts a where a.student_id = st.id) as last_active,
      (select coalesce(json_object_agg(skill, json_build_object('right', r_, 'total', t_)), '{}'::json) from (
         select e->>'skill' as skill, count(*) filter (where (e->>'first_try')::boolean) as r_, count(*) as t_
           from ck_attempts a, jsonb_array_elements(a.answers) e
          where a.student_id = st.id group by 1) k) as skills
    from ck_students st where st.class_code = p_class and st.role = 'student') r), '[]'::json);
end $$;

create or replace function ck_teacher_student(p_token uuid, p_student uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  return json_build_object(
    'student', (select json_build_object('id', id, 'name', display_name, 'username', username,
                 'class_code', class_code, 'level', level, 'xp_total', xp_total) from ck_students where id = p_student),
    'history', coalesce((select json_agg(a order by a.created_at) from (
       select id, mode, text_id, level_start, level_end, score, max_score, xp, seconds, answers, created_at
         from ck_attempts where student_id = p_student) a), '[]'::json));
end $$;

create or replace function ck_teacher_reset_pin(p_token uuid, p_student uuid, p_pin text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  if p_pin !~ '^[0-9]{4}$' then raise exception 'A PIN must be 4 digits.'; end if;
  update ck_students set pin_hash = crypt(p_pin, gen_salt('bf')), failed_logins = 0, locked_until = null
   where id = p_student and role = 'student';
  delete from ck_tokens where student_id = p_student;
end $$;

-- Only the public entry points can be called from the website.
revoke execute on function ck_auth(uuid), ck_require_teacher(uuid) from public, anon, authenticated;
grant execute on function ck_login(text, text), ck_logout(uuid), ck_me(uuid), ck_history(uuid),
  ck_save_attempt(uuid, jsonb), ck_leaderboard(uuid, text), ck_teacher_classes(uuid),
  ck_teacher_class(uuid, text), ck_teacher_student(uuid, uuid), ck_teacher_reset_pin(uuid, uuid, text)
  to anon;
