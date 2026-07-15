export function formatCardBrand(brand: string): string {
  const labels: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    rupay: 'RuPay',
    unknown: 'Card',
  };
  return labels[brand] ?? 'Card';
}
