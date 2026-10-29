// One set of line icons (24×24, drawn with the current text colour) and coloured icon tiles.
// Tiles mix a fixed colour for each section with the student's theme colour, so they change with the theme.
const P = {
  mission: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  read: '<path d="M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1V19c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1z"/><path d="M12 6.5V20"/>',
  listen: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.8"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8"/>',
  words: '<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 13l2-6 2 6M8.7 11h2.6M14.5 10.5a1.6 1.6 0 1 1 0 2.5M16.1 9.5v3.5"/>',
  grammar: '<path d="M9 3h4v3a2 2 0 1 0 4 0V3h4v8h-3a2 2 0 1 0 0 4h3v6H3v-6h3a2 2 0 1 0 0-4H3V3h6"/>',
  games: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="18" cy="14" r="1" fill="currentColor"/>',
  cards: '<rect x="3" y="6" width="12" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>',
  family: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v9M12 11H5v5.5M12 11h7v5.5"/>',
  boss: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8 21h8M9 21l1-4h4l1 4"/>',
  review: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
  stats: '<path d="M4 20h16"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6" width="3" height="12" rx="1"/><rect x="16" y="13" width="3" height="5" rx="1"/>',
  workout: '<path d="M13 2L5 13h6l-1 9 8-11h-6z"/>',
  badge: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
  rain: '<path d="M7 15a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 7.5a3.8 3.8 0 0 1-.5 7.5z"/><path d="M8 18l-1 3M12.5 18l-1 3M17 18l-1 3"/>',
  train: '<rect x="5" y="3" width="14" height="14" rx="4"/><path d="M5 10h14M9 13.5h.01M15 13.5h.01M8 17l-2 4M16 17l2 4"/>',
  speed: '<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4M10 2h4M12 5V2"/>',
  dodge: '<circle cx="9" cy="14.5" r="6.5"/><circle cx="18" cy="6" r="3.5"/><path d="M6 12.5a3.2 3.2 0 0 1 2.6-2.2M16.6 4.9a1.4 1.4 0 0 1 1.1-.6"/>',
  escape: '<path d="M14 3H6v18h8"/><path d="M14 3l5 2v16l-5-2z"/><path d="M16.5 12h.01"/>',
  lab: '<circle cx="10" cy="10" r="6.5"/><path d="M15 15l5.5 5.5"/><path d="M6.5 10h1.2l1.2-2.5 2 5 1.2-2.5h1.4"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  u1: '<path d="M3 10v4h3l7 5V5L6 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  u2: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  u3: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M8 7v13M16 7v13"/>',
  u4: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
  u5: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.5 18.5h3"/>',
  u6: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
  u7: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8 21h8M9 21l1-4h4l1 4"/>',
  u8: '<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
  u9: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'
};
// The colour of each kind of tile (light-mode values; the theme colour is mixed in by CSS).
const HUE = { mission: "#D29A0F", read: "#1E8C87", listen: "#7B4FC4", words: "#2F6FB5", grammar: "#D9622B", games: "#C2417A",
  cards: "#2F6FB5", family: "#2F6FB5", boss: "#D29A0F", review: "#D9622B", stats: "#C98A0B", workout: "#D9622B", badge: "#C98A0B",
  escape: "#7B4FC4", lab: "#E07B1F", rain: "#2F7FC1", train: "#2A7A4B", speed: "#C2417A", dodge: "#1F8FB3", u: "#1E8C87" };

export function icon(name, size = 22) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[name] || ""}</svg>`;
}
// A rounded coloured square with a white icon. size: "s" (32px), "m" (44px) or "l" (64px).
export function tile(name, size = "m") {
  const hue = HUE[name] || HUE[name[0] === "u" ? "u" : ""] || "#1E8C87";
  return `<span class="itile ${size}" style="--hue:${hue}">${icon(name, size === "l" ? 34 : size === "s" ? 18 : 24)}</span>`;
}
export const unitIcon = u => "u" + u;
export const hue = name => HUE[name] || HUE.u;
