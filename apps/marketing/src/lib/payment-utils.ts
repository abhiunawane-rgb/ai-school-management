export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'rupay' | 'unknown';
export type PaymentProvider = 'stripe' | 'razorpay';

export interface PaymentMethodInput {
  cardholderName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface StoredPaymentMethod {
  cardholderName: string;
  last4: string;
  brand: CardBrand;
  expMonth: number;
  expYear: number;
  provider: PaymentProvider;
  /** Token from Stripe/Razorpay — never store raw card data */
  paymentMethodToken: string;
  onFileSince: string;
}

export function paymentProviderForCurrency(currency: string): PaymentProvider {
  return currency === 'INR' ? 'razorpay' : 'stripe';
}

export function detectCardBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^(508|60|65|81|82|83)/.test(digits)) return 'rupay';
  return 'unknown';
}

function luhnCheck(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i]!, 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function validatePaymentMethod(input: PaymentMethodInput): string | null {
  const name = input.cardholderName.trim();
  if (name.length < 2) return 'Enter the name on card';

  const digits = input.cardNumber.replace(/\D/g, '');
  if (digits.length < 15 || digits.length > 16) return 'Enter a valid debit or credit card number';
  if (!luhnCheck(digits)) return 'Card number is not valid';

  const brand = detectCardBrand(digits);
  if (brand === 'amex' && digits.length !== 15) return 'American Express cards use 15 digits';
  if (brand !== 'amex' && digits.length !== 16) return 'Card number must be 16 digits';

  const month = parseInt(input.expMonth, 10);
  if (month < 1 || month > 12) return 'Enter expiry month (01–12)';

  const yearRaw = input.expYear.replace(/\D/g, '');
  const year = yearRaw.length === 2 ? 2000 + parseInt(yearRaw, 10) : parseInt(yearRaw, 10);
  const now = new Date();
  const expEnd = new Date(year, month, 0);
  if (expEnd < new Date(now.getFullYear(), now.getMonth(), 1)) {
    return 'Card has expired';
  }

  const cvvLen = brand === 'amex' ? 4 : 3;
  const cvv = input.cvv.replace(/\D/g, '');
  if (cvv.length !== cvvLen) return `Enter ${cvvLen}-digit CVV`;

  return null;
}

/** Build a safe payment method record — card number is discarded */
export function tokenizePaymentMethod(
  input: PaymentMethodInput,
  currency: string
): StoredPaymentMethod {
  const digits = input.cardNumber.replace(/\D/g, '');
  const yearRaw = input.expYear.replace(/\D/g, '');
  const expYear = yearRaw.length === 2 ? 2000 + parseInt(yearRaw, 10) : parseInt(yearRaw, 10);

  return {
    cardholderName: input.cardholderName.trim(),
    last4: digits.slice(-4),
    brand: detectCardBrand(digits),
    expMonth: parseInt(input.expMonth, 10),
    expYear,
    provider: paymentProviderForCurrency(currency),
    paymentMethodToken: `pm_demo_${Date.now()}_${digits.slice(-4)}`,
    onFileSince: new Date().toISOString(),
  };
}

export function formatCardBrand(brand: CardBrand): string {
  const labels: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    rupay: 'RuPay',
    unknown: 'Card',
  };
  return labels[brand];
}

export function nextBillingDateAfterTrial(trialDays: number, interval: 'monthly' | 'yearly'): string {
  const d = new Date();
  d.setDate(d.getDate() + trialDays);
  return d.toISOString();
}
