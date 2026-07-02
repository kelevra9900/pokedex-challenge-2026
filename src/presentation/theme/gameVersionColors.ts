const GAME_VERSION_COLORS: Record<string, string> = {
  red: '#E74C3C',
  blue: '#3498DB',
  yellow: '#F1C40F',
  gold: '#D4AF37',
  silver: '#A6ACAF',
  crystal: '#48C9B0',
  ruby: '#C0392B',
  sapphire: '#2980B9',
  emerald: '#27AE60',
  firered: '#E67E22',
  leafgreen: '#2ECC71',
  diamond: '#85C1E9',
  pearl: '#F1948A',
  platinum: '#5D6D7E',
  heartgold: '#D4AF37',
  soulsilver: '#A6ACAF',
  black: '#2C3E50',
  white: '#BDC3C7',
  'black-2': '#2C3E50',
  'white-2': '#BDC3C7',
  x: '#2980B9',
  y: '#C0392B',
};

export function getGameVersionColor(version: string): string {
  return GAME_VERSION_COLORS[version.toLowerCase()] ?? '#95A5A6';
}
