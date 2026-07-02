function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}

export function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = clamp(((num >> 16) & 0xff) + Math.round((percent / 100) * 255));
  const g = clamp(((num >> 8) & 0xff) + Math.round((percent / 100) * 255));
  const b = clamp((num & 0xff) + Math.round((percent / 100) * 255));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
