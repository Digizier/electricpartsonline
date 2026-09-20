export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount || 0);
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
}

export function getDeterministicRating(seed: string): { rating: number; reviewCount: number } {
  if (!seed) return { rating: 4.8, reviewCount: 12 };

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const ratingVariations = [4.7, 4.8, 4.9, 4.8, 4.6, 4.8, 4.7, 4.9];
  const rating = ratingVariations[absHash % ratingVariations.length];
  const reviewCount = 18 + ((absHash >> 2) % 31);

  return { rating, reviewCount };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
