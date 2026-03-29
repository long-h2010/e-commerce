export function formatNumberCount(count: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(count).replace(/K/g, 'k');;
}
