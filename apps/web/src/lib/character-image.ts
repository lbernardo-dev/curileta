const CHARACTER_IMAGE_ASPECTS: Record<string, string> = {
  'canguro-bebe-main.webp': '4 / 3',
  'cobaya-main.webp': '4 / 3',
  'emu-main.webp': '4 / 3',
  'joey-main.webp': '4 / 3',
  'lola-main.webp': '4 / 3',
  'lulu-main.webp': '4 / 3',
  'ornitorrinco-main.webp': '4 / 3',
  'picu-main.webp': '4 / 3',
  'zipi-bot-main.webp': '4 / 3',
  'pez-volador-main.webp': '16 / 9',
};

export function getCharacterImageAspectRatio(source: string, declaredRatio?: number): string {
  const filename = source.split('/').pop()?.toLowerCase() || '';
  return CHARACTER_IMAGE_ASPECTS[filename] || (declaredRatio ? String(declaredRatio) : '4 / 5');
}
