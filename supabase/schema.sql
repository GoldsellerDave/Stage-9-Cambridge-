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
-- Reading levels: 0 Easier, 1 Core, 2 Harder, 3 Challenge (C1).
alter table ck_students drop constraint if exists ck_students_level_check;
alter table ck_students add constraint ck_students_level_check check (level between 0 and 3);

-- Teachers and classes. Each class belongs to one teacher, who sees only their own classes.
-- The admin (the first teacher, set up by seed.sql) sees every class and adds colleagues.
alter table ck_students add column if not exists is_admin    boolean not null default false;
alter table ck_students add column if not exists must_change boolean not null default false;  -- one-time password still in use
create table if not exists ck_classes (
  code       text primary key,
  teacher_id uuid references ck_students(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table ck_classes enable row level security;
revoke all on ck_classes from anon, authenticated;
-- First run of this version: the first teacher becomes the admin and owns the classes that already exist.
update ck_students set is_admin = true
 where id = (select id from ck_students where role = 'teacher' order by created_at, username limit 1)
   and not exists (select 1 from ck_students where is_admin);
insert into ck_classes(code, teacher_id)
  select distinct class_code, (select id from ck_students where is_admin order by created_at limit 1)
    from ck_students where role = 'student'
  on conflict (code) do nothing;

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
                           'class_code', s.class_code, 'level', s.level, 'must_change', s.must_change);
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
    'role', s.role, 'level', s.level, 'xp_total', s.xp_total, 'is_admin', s.is_admin, 'must_change', s.must_change,
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
  -- next_level is the steady level (middle of the last three readings) worked out by the website.
  v_level := case when (p_attempt->>'mode') in ('baseline', 'practice')
                  then least(greatest(coalesce((p_attempt->>'next_level')::int, (p_attempt->>'level_end')::int), 0), 3) else s.level end;
  insert into ck_attempts(student_id, mode, text_id, level_start, level_end, score, max_score, xp, seconds, answers)
  values (s.id, p_attempt->>'mode', left(coalesce(p_attempt->>'text_id', ''), 60),
          (p_attempt->>'level_start')::smallint,
          case when (p_attempt->>'mode') in ('baseline', 'practice') then least(greatest((p_attempt->>'level_end')::int, 0), 3) end,
          coalesce((p_attempt->>'score')::int, 0), coalesce((p_attempt->>'max_score')::int, 0),
          v_xp, least(coalesce((p_attempt->>'seconds')::int, 0), 36000),
          coalesce(p_attempt->'answers', '[]'::jsonb));
  update ck_students set xp_total = xp_total + v_xp, level = v_level where id = s.id
  returning xp_total, level into s.xp_total, s.level;
  return json_build_object('xp_total', s.xp_total, 'level', s.level);
end $$;

-- Class leaderboards: XP this week, XP all time, and most improved
-- (percentage points from the first baseline to the latest baseline or Checkpoint check).
create or replace function ck_leaderboard(p_token uuid, p_class text default null) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token); v_class text;
begin
  v_class := case when s.role = 'teacher' and p_class is not null then p_class else s.class_code end;
  if s.role = 'teacher' and not ck_can_see(s, v_class) then raise exception 'You can only see your own classes.'; end if;
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
               (array_agg(a.score * 100 / nullif(a.max_score, 0) order by a.created_at desc))[1]
             - (array_agg(a.score * 100 / nullif(a.max_score, 0) order by a.created_at))[1] as gain
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

-- Can this teacher see this class? The admin sees all; other teachers only their own.
create or replace function ck_can_see(s ck_students, p_class text) returns boolean
language sql stable security definer set search_path = public as $$
  select s.role = 'teacher' and (s.is_admin or exists(select 1 from ck_classes where code = p_class and teacher_id = s.id))
$$;
create or replace function ck_require_class(p_token uuid, p_class text) returns ck_students
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  if not ck_can_see(s, p_class) then raise exception 'You can only see your own classes.'; end if;
  return s;
end $$;
create or replace function ck_require_student_of(p_token uuid, p_student uuid) returns ck_students
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token); c text;
begin
  select class_code into c from ck_students where id = p_student and role = 'student';
  if c is null or not ck_can_see(s, c) then raise exception 'You can only see students in your own classes.'; end if;
  return s;
end $$;

-- The classes this teacher can see, with the owner's name and the number of students.
create or replace function ck_teacher_classes(p_token uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  return coalesce((select json_agg(r order by r.code) from (
    select c.code, c.teacher_id = s.id as mine, t.display_name as teacher,
           (select count(*) from ck_students st where st.class_code = c.code and st.role = 'student')::int as students
      from ck_classes c left join ck_students t on t.id = c.teacher_id
     where s.is_admin or c.teacher_id = s.id) r), '[]'::json);
end $$;

create or replace function ck_teacher_class(p_token uuid, p_class text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_class(p_token, p_class);
begin
  return coalesce((select json_agg(r order by r.username) from (
    select st.id, st.display_name as name, st.username, st.level, st.xp_total,
      (select coalesce(sum(xp), 0) from ck_attempts a where a.student_id = st.id and a.created_at >= ck_week_start())::int as xp_week,
      (select count(*) from ck_attempts a where a.student_id = st.id and a.mode = 'practice')::int as texts_done,
      (select score * 100 / nullif(max_score, 0) from ck_attempts a where a.student_id = st.id and a.mode = 'baseline' order by created_at limit 1) as baseline_first,
      (select score * 100 / nullif(max_score, 0) from ck_attempts a where a.student_id = st.id and a.mode = 'baseline' order by created_at desc limit 1) as baseline_latest,
      (select max(created_at) from ck_attempts a where a.student_id = st.id) as last_active,
      (select coalesce(json_object_agg(skill, json_build_object('right', r_, 'total', t_)), '{}'::json) from (
         select e->>'skill' as skill, count(*) filter (where (e->>'first_try')::boolean) as r_, count(*) as t_
           from ck_attempts a, jsonb_array_elements(a.answers) e
          where a.student_id = st.id group by 1) k) as skills,
      -- Listening traps (Listening Lab and Trap Dodger): how often each examiner's trick caught the student
      (select coalesce(json_object_agg(trap, json_build_object('caught', c_, 'total', t_)), '{}'::json) from (
         select e->>'trap' as trap, count(*) filter (where not coalesce((e->>'first_try')::boolean, false)) as c_, count(*) as t_
           from ck_attempts a, jsonb_array_elements(a.answers) e
          where a.student_id = st.id and e->>'skill' in ('Listening', 'Trap game') and e->>'trap' is not null group by 1) k2) as traps,
      -- Listening Lab levels: missions done, highest level reached, and the level the next mission starts on
      (select json_build_object('missions', count(distinct a.text_id), 'peak', coalesce(max((e->>'level')::int), 0),
         'now', (select coalesce((e2->>'next')::int, (e2->>'level')::int, 0)
                   from ck_attempts a2, jsonb_array_elements(a2.answers) with ordinality x2(e2, n2)
                  where a2.student_id = st.id and a2.mode = 'listening' and a2.text_id like 'lab-%' and e2->>'skill' = 'Listening' and e2 ? 'lab'
                  order by a2.created_at desc, n2 desc limit 1))
         from ck_attempts a, jsonb_array_elements(a.answers) e
        where a.student_id = st.id and a.mode = 'listening' and a.text_id like 'lab-%' and e->>'skill' = 'Listening' and e ? 'lab'
       having count(*) > 0) as lab
    from ck_students st where st.class_code = p_class and st.role = 'student') r), '[]'::json);
end $$;

create or replace function ck_teacher_student(p_token uuid, p_student uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_student_of(p_token, p_student);
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
declare s ck_students := ck_require_student_of(p_token, p_student);
begin
  if p_pin !~ '^[0-9]{4}$' then raise exception 'A PIN must be 4 digits.'; end if;
  update ck_students set pin_hash = crypt(p_pin, gen_salt('bf')), failed_logins = 0, locked_until = null
   where id = p_student and role = 'student';
  delete from ck_tokens where student_id = p_student;
end $$;

/* ---------------- AI marking log ---------------- */
-- The "grade" Edge Function (supabase/functions/grade) writes one row per AI check, using the service key.
-- Teachers can read the log and flag a decision they disagree with. A flag does not change XP or scores.
create table if not exists ck_ai_log (
  id         bigint generated always as identity primary key,
  student_id uuid not null references ck_students(id) on delete cascade,
  created_at timestamptz not null default now(),
  text_id    text not null,
  slot       smallint,
  level      smallint,
  question   text,
  answer     text not null,
  ok         boolean not null,
  hits       jsonb not null default '[]',
  feedback   text,
  model      text,
  overruled  boolean not null default false
);
create index if not exists ck_ai_log_student on ck_ai_log(student_id, created_at);
alter table ck_ai_log enable row level security;
revoke all on ck_ai_log from anon, authenticated;

create or replace function ck_teacher_ai_log(p_token uuid, p_class text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_class(p_token, p_class);
begin
  return coalesce((select json_agg(r order by r.created_at desc) from (
    select l.id, l.created_at, st.display_name as name, l.text_id, l.level, l.question, l.answer, l.ok, l.hits, l.feedback, l.overruled
      from ck_ai_log l join ck_students st on st.id = l.student_id
     where st.class_code = p_class order by l.created_at desc limit 200) r), '[]'::json);
end $$;

create or replace function ck_teacher_ai_flag(p_token uuid, p_id bigint, p_overruled boolean) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  update ck_ai_log l set overruled = p_overruled from ck_students st
   where l.id = p_id and st.id = l.student_id and ck_can_see(s, st.class_code);
end $$;

/* ---------------- classes and teachers (self-service) ---------------- */
create or replace function ck_new_pin() returns text
language sql volatile as $$ select lpad(floor(random() * 10000)::int::text, 4, '0') $$;
create or replace function ck_new_password() returns text
language sql volatile as $$
  select string_agg(substr('abcdefghjkmnpqrstuvwxyz23456789', 1 + floor(random() * 31)::int, 1), '') from generate_series(1, 8)
$$;

-- Add students to a class, making the class first if it is new. Returns each new student's username and PIN,
-- for the login sheet: PINs are stored scrambled, so this is the only time they can be shown.
create or replace function ck_teacher_add_students(p_token uuid, p_class text, p_names jsonb) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token); v_code text := upper(regexp_replace(coalesce(p_class, ''), '\s', '', 'g'));
        v_owner uuid; v_n int; v_name text; v_pin text; v_user text; out jsonb := '[]';
begin
  if v_code !~ '^[A-Z0-9]{2,10}$' then raise exception 'A class code is 2 to 10 letters or numbers, for example 8B4.'; end if;
  if jsonb_typeof(p_names) <> 'array' or jsonb_array_length(p_names) = 0 then raise exception 'Add at least one name.'; end if;
  if jsonb_array_length(p_names) > 60 then raise exception 'Add up to 60 names at a time.'; end if;
  select teacher_id into v_owner from ck_classes where code = v_code;
  if not found then
    if exists(select 1 from ck_students where class_code = v_code) then raise exception 'That class code is already used.'; end if;
    insert into ck_classes(code, teacher_id) values (v_code, s.id);
  elsif not ck_can_see(s, v_code) then raise exception 'Class % belongs to another teacher. Choose a different code.', v_code;
  end if;
  select coalesce(max(substring(username from '-([0-9]+)$')::int), 0) into v_n
    from ck_students where class_code = v_code and role = 'student';
  for v_name in select left(trim(x), 80) from jsonb_array_elements_text(p_names) x where trim(x) <> '' loop
    v_n := v_n + 1; v_pin := ck_new_pin(); v_user := lower(v_code) || '-' || lpad(v_n::text, 2, '0');
    if exists(select 1 from ck_students where username = v_user) then raise exception 'Username % is already taken.', v_user; end if;
    insert into ck_students(class_code, username, display_name, pin_hash, role)
    values (v_code, v_user, v_name, crypt(v_pin, gen_salt('bf')), 'student');
    out := out || jsonb_build_object('no', v_n, 'name', v_name, 'username', v_user, 'pin', v_pin);
  end loop;
  return json_build_object('class_code', v_code, 'students', out);
end $$;

-- New PINs for a whole class, for a fresh login sheet. Everyone in the class is signed out.
create or replace function ck_teacher_new_pins(p_token uuid, p_class text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_class(p_token, p_class); r record; v_pin text; out jsonb := '[]';
begin
  for r in select id, username, display_name from ck_students where class_code = p_class and role = 'student' order by username loop
    v_pin := ck_new_pin();
    update ck_students set pin_hash = crypt(v_pin, gen_salt('bf')), failed_logins = 0, locked_until = null where id = r.id;
    delete from ck_tokens where student_id = r.id;
    out := out || jsonb_build_object('no', coalesce(substring(r.username from '-([0-9]+)$')::int, 0), 'name', r.display_name, 'username', r.username, 'pin', v_pin);
  end loop;
  return json_build_object('class_code', p_class, 'students', out);
end $$;

-- Remove one student, with all their work. Cannot be undone.
create or replace function ck_teacher_remove_student(p_token uuid, p_student uuid) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_student_of(p_token, p_student);
begin
  delete from ck_students where id = p_student and role = 'student';
end $$;

-- Delete a class with all its students and their work. Cannot be undone.
create or replace function ck_teacher_delete_class(p_token uuid, p_class text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_class(p_token, p_class);
begin
  delete from ck_students where class_code = p_class and role = 'student';
  delete from ck_classes where code = p_class;
end $$;

-- A teacher changes their own password (and must, after a one-time password).
create or replace function ck_set_password(p_token uuid, p_old text, p_new text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  if s.pin_hash <> crypt(trim(coalesce(p_old, '')), s.pin_hash) then raise exception 'Your current password is not right.'; end if;
  if length(trim(coalesce(p_new, ''))) < 8 then raise exception 'Choose a password of at least 8 characters.'; end if;
  update ck_students set pin_hash = crypt(trim(p_new), gen_salt('bf')), must_change = false where id = s.id;
end $$;

/* admin only */
create or replace function ck_require_admin(p_token uuid) returns ck_students
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  if not s.is_admin then raise exception 'Only the admin can manage teachers.'; end if;
  return s;
end $$;

create or replace function ck_admin_teachers(p_token uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_admin(p_token);
begin
  return coalesce((select json_agg(r order by r.is_admin desc, r.name) from (
    select t.id, t.display_name as name, t.username, t.is_admin, t.must_change, t.id = s.id as me,
           coalesce((select json_agg(code order by code) from ck_classes where teacher_id = t.id), '[]'::json) as classes
      from ck_students t where t.role = 'teacher') r), '[]'::json);
end $$;

-- Add a colleague. Returns a one-time password to pass on; they choose their own at first sign-in.
create or replace function ck_admin_add_teacher(p_token uuid, p_name text, p_username text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_admin(p_token); v_user text := lower(trim(coalesce(p_username, ''))); v_pw text := ck_new_password();
begin
  if length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Type the teacher''s name.'; end if;
  if v_user !~ '^[a-z][a-z0-9.]{2,29}$' then raise exception 'A username is 3 to 30 letters, numbers or dots, starting with a letter (for example ms.lan).'; end if;
  if exists(select 1 from ck_students where username = v_user) then raise exception 'That username is already taken.'; end if;
  insert into ck_students(class_code, username, display_name, pin_hash, role, must_change)
  values ('TEACHER', v_user, left(trim(p_name), 80), crypt(v_pw, gen_salt('bf')), 'teacher', true);
  return json_build_object('username', v_user, 'password', v_pw);
end $$;

-- A new one-time password for a colleague who forgot theirs. They are signed out everywhere.
create or replace function ck_admin_reset_teacher(p_token uuid, p_teacher uuid) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_admin(p_token); v_pw text := ck_new_password(); v_user text;
begin
  update ck_students set pin_hash = crypt(v_pw, gen_salt('bf')), must_change = true, failed_logins = 0, locked_until = null
   where id = p_teacher and role = 'teacher' and id <> s.id returning username into v_user;
  if v_user is null then raise exception 'Teacher not found.'; end if;
  delete from ck_tokens where student_id = p_teacher;
  return json_build_object('username', v_user, 'password', v_pw);
end $$;

-- Remove a colleague's account. Their classes and students stay, and the admin can give them to another teacher.
create or replace function ck_admin_remove_teacher(p_token uuid, p_teacher uuid) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_admin(p_token);
begin
  if p_teacher = s.id then raise exception 'You cannot remove your own account.'; end if;
  delete from ck_students where id = p_teacher and role = 'teacher';
end $$;

-- Give a class to another teacher.
create or replace function ck_admin_move_class(p_token uuid, p_class text, p_teacher uuid) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_admin(p_token);
begin
  if not exists(select 1 from ck_students where id = p_teacher and role = 'teacher') then raise exception 'Teacher not found.'; end if;
  update ck_classes set teacher_id = p_teacher where code = p_class;
end $$;

/* ---------------- live escape room (team mode) ---------------- */
-- The teacher opens a game for a class and gets a 4-digit code. Teams join on one device each (signed in as one of
-- the team), wait, and all start together when the teacher presses Start. The board shows each team's room and time.
-- Everyone gets the same puzzles (made from the seed). Times are worked out on the server, so device clocks don't matter.
create table if not exists ck_live (
  id          bigint generated always as identity primary key,
  code        text not null,
  class_code  text not null,
  unit        smallint not null,
  teacher_id  uuid references ck_students(id) on delete cascade,
  status      text not null default 'waiting' check (status in ('waiting', 'playing', 'ended')),
  seed        integer not null,
  started_at  timestamptz,
  created_at  timestamptz not null default now()
);
create unique index if not exists ck_live_open_code on ck_live(code) where status <> 'ended';
create table if not exists ck_live_teams (
  live_id     bigint not null references ck_live(id) on delete cascade,
  team        text not null,
  student_id  uuid references ck_students(id) on delete set null,
  room        smallint not null default 0,
  solved      smallint not null default 0,
  penalty     integer not null default 0,
  seconds     integer,
  finished_at timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (live_id, team)
);
alter table ck_live enable row level security;
alter table ck_live_teams enable row level security;
revoke all on ck_live, ck_live_teams from anon, authenticated;

create or replace function ck_live_start(p_token uuid, p_class text, p_unit int) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_class(p_token, p_class); v_code text; v_seed int := floor(random() * 2000000000)::int;
begin
  update ck_live set status = 'ended' where teacher_id = s.id and status <> 'ended';
  loop
    v_code := lpad(floor(1000 + random() * 9000)::int::text, 4, '0');
    exit when not exists(select 1 from ck_live where code = v_code and status <> 'ended');
  end loop;
  insert into ck_live(code, class_code, unit, teacher_id, seed) values (v_code, p_class, p_unit, s.id, v_seed);
  return json_build_object('code', v_code);
end $$;

create or replace function ck_live_control(p_token uuid, p_code text, p_action text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token);
begin
  if p_action = 'start' then
    update ck_live set status = 'playing', started_at = now() where code = p_code and teacher_id = s.id and status = 'waiting';
  elsif p_action = 'end' then
    update ck_live set status = 'ended' where code = p_code and teacher_id = s.id and status <> 'ended';
  else raise exception 'Unknown action.'; end if;
end $$;

create or replace function ck_live_board(p_token uuid, p_code text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_require_teacher(p_token); l ck_live;
begin
  select * into l from ck_live where code = p_code and teacher_id = s.id order by id desc limit 1;
  if l.id is null then raise exception 'Game not found.'; end if;
  return json_build_object('code', l.code, 'unit', l.unit, 'class_code', l.class_code, 'status', l.status,
    'elapsed', case when l.started_at is null then 0 else extract(epoch from now() - l.started_at)::int end,
    'teams', coalesce((select json_agg(r order by r.finished is null, r.seconds, r.room desc, r.solved desc, r.team) from (
       select t.team, t.room, t.solved, t.penalty, t.seconds, t.finished_at as finished, st.display_name as device
         from ck_live_teams t left join ck_students st on st.id = t.student_id where t.live_id = l.id) r), '[]'::json));
end $$;

-- What a team device needs: the game (unit and seed), whether it has started, and the server's clock.
create or replace function ck_live_join(p_token uuid, p_code text, p_team text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token); l ck_live; v_team text := left(trim(coalesce(p_team, '')), 24);
begin
  select * into l from ck_live where code = trim(p_code) and status <> 'ended';
  if l.id is null then raise exception 'No game with that code. Check the code on the board.'; end if;
  if s.role = 'student' and s.class_code <> l.class_code then raise exception 'That game is for another class.'; end if;
  if v_team <> '' then
    insert into ck_live_teams(live_id, team, student_id) values (l.id, v_team, s.id)
    on conflict (live_id, team) do update set student_id = excluded.student_id
      where ck_live_teams.student_id = excluded.student_id or ck_live_teams.student_id is null;
    if not exists(select 1 from ck_live_teams where live_id = l.id and team = v_team and student_id = s.id) then
      raise exception 'Another device already uses that team name. Choose a different one.';
    end if;
  end if;
  return json_build_object('code', l.code, 'unit', l.unit, 'seed', l.seed, 'status', l.status,
    'elapsed', case when l.started_at is null then 0 else extract(epoch from now() - l.started_at) end);
end $$;

create or replace function ck_live_progress(p_token uuid, p_code text, p_team text, p_room int, p_solved int, p_penalty int, p_out boolean)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token); l ck_live; v_secs int;
begin
  select * into l from ck_live where code = trim(p_code) and status = 'playing';
  if l.id is null then return json_build_object('status', 'ended'); end if;
  v_secs := extract(epoch from now() - l.started_at)::int + greatest(coalesce(p_penalty, 0), -90);   -- golden keys take off up to 90 s
  update ck_live_teams set room = least(greatest(p_room, 0), 9), solved = least(greatest(p_solved, 0), 30),
         penalty = greatest(coalesce(p_penalty, 0), -90), updated_at = now(),
         seconds = case when p_out and finished_at is null then v_secs else seconds end,
         finished_at = case when p_out and finished_at is null then now() else finished_at end
   where live_id = l.id and team = p_team and student_id = s.id;
  return json_build_object('status', l.status, 'seconds', v_secs,
    'place', (select count(*) + 1 from ck_live_teams t where t.live_id = l.id and t.finished_at is not null
               and t.seconds < (select seconds from ck_live_teams where live_id = l.id and team = p_team)));
end $$;

-- What the other teams are doing, for the "rival" alerts on team tablets: names, rooms and who is out. No times or devices.
create or replace function ck_live_feed(p_token uuid, p_code text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare s ck_students := ck_auth(p_token); l ck_live;
begin
  select * into l from ck_live where code = trim(p_code) order by id desc limit 1;
  if l.id is null then raise exception 'Game not found.'; end if;
  if s.role = 'student' and s.class_code <> l.class_code then raise exception 'That game is for another class.'; end if;
  return json_build_object('status', l.status,
    'teams', coalesce((select json_agg(json_build_object('team', t.team, 'room', t.room, 'solved', t.solved, 'out', t.finished_at is not null) order by t.team)
                         from ck_live_teams t where t.live_id = l.id), '[]'::json));
end $$;

-- Only the public entry points can be called from the website.
revoke execute on function ck_auth(uuid), ck_require_teacher(uuid), ck_require_class(uuid, text), ck_require_student_of(uuid, uuid),
  ck_require_admin(uuid), ck_can_see(ck_students, text), ck_new_pin(), ck_new_password() from public, anon, authenticated;
grant execute on function ck_login(text, text), ck_logout(uuid), ck_me(uuid), ck_history(uuid),
  ck_save_attempt(uuid, jsonb), ck_leaderboard(uuid, text), ck_teacher_classes(uuid),
  ck_teacher_class(uuid, text), ck_teacher_student(uuid, uuid), ck_teacher_reset_pin(uuid, uuid, text),
  ck_teacher_ai_log(uuid, text), ck_teacher_ai_flag(uuid, bigint, boolean),
  ck_teacher_add_students(uuid, text, jsonb), ck_teacher_new_pins(uuid, text), ck_teacher_remove_student(uuid, uuid),
  ck_teacher_delete_class(uuid, text), ck_set_password(uuid, text, text), ck_admin_teachers(uuid),
  ck_admin_add_teacher(uuid, text, text), ck_admin_reset_teacher(uuid, uuid), ck_admin_remove_teacher(uuid, uuid),
  ck_admin_move_class(uuid, text, uuid), ck_live_start(uuid, text, int), ck_live_control(uuid, text, text),
  ck_live_board(uuid, text), ck_live_join(uuid, text, text), ck_live_progress(uuid, text, text, int, int, int, boolean),
  ck_live_feed(uuid, text)
  to anon;
