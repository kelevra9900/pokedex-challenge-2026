const CARD_ACCENTS = [
  '#FFD3B0',
  '#B8E8FC',
  '#C9F2C7',
  '#FFD6E8',
  '#E4D9FF',
  '#FFF3B0',
  '#C7F9E5',
  '#FFC9C9',
];

export function getCardAccentColor(id: number): string {
  return CARD_ACCENTS[id % CARD_ACCENTS.length];
}
