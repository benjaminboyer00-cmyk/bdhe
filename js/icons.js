// Small hand-drawn line-icon system, consistent stroke across the whole app.
// Kept intentionally abstract/geometric (no external icon font/library).

const NAV_ICONS = {
  home: `<path d="M4 11 12 4l8 7"/><path d="M6 10v9h5v-5h2v5h5v-9"/>`,
  programs: `<path d="M2 9v6"/><path d="M22 9v6"/><rect x="4" y="8" width="3" height="8" rx="1"/><rect x="17" y="8" width="3" height="8" rx="1"/><path d="M7 12h10"/>`,
  quiz: `<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M8.5 12.5l2.2 2.2 4.3-4.4"/>`,
  calc: `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8.5 12h.5M12 12h.5M15.5 12h.5M8.5 15.5h.5M12 15.5h.5M15.5 15.5h.5M8.5 19h.5M12 19h.5"/>`,
  progress: `<path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/><path d="M3 20h18"/>`,
  mark: `<circle cx="12" cy="14" r="7"/><path d="M9 7a3 3 0 0 1 6 0v3H9V7z"/>`,
  sun: `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9"/>`,
  moon: `<path d="M20 14.3A8.4 8.4 0 1 1 9.7 4a6.9 6.9 0 0 0 10.3 10.3z"/>`
};

const PATTERN_ICONS = {
  HINGE: `<path d="M6 18 12 10 18 6"/><path d="M12 10v-7"/>`,
  SQUAT: `<path d="M12 3v10"/><path d="M8 10l4 4 4-4"/><path d="M6 21h12"/>`,
  PUSH: `<path d="M4 12h13"/><path d="M13 7l5 5-5 5"/>`,
  PULL: `<path d="M20 12H7"/><path d="M11 7l-5 5 5 5"/>`,
  CARRY: `<rect x="3" y="9" width="4" height="7" rx="1"/><rect x="17" y="9" width="4" height="7" rx="1"/><path d="M7 12.5h10"/>`,
  ROTATION: `<path d="M4 12a8 8 0 1 1 2.6 5.9"/><path d="M4 12v5h5"/>`,
  CORE: `<path d="M4 17h16"/><path d="M6 17l4-8h4l4 8"/>`,
  CARDIO: `<path d="M3 12h4l2-6 4 12 2-6h6"/>`,
  MOBILITY: `<path d="M5 18c3-8 11-8 14 0"/><path d="M8 8c1.5-2 6.5-2 8 0"/>`
};

function svgWrap(markup, color){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${color || 'currentColor'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${markup}</svg>`;
}
function navIcon(key){ return svgWrap(NAV_ICONS[key] || ''); }
function patternIcon(key, color){ return svgWrap(PATTERN_ICONS[key] || PATTERN_ICONS.CORE, color); }
