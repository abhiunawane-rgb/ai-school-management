export interface PaymentIntent {
  id: string;
  tenantId: string;
  amount: number;
  currency: string;
  provider: 'stripe' | 'razorpay';
  providerIntentId: string;
  status: 'created' | 'processing' | 'succeeded' | 'failed';
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  provider: 'stripe' | 'razorpay';
  type: string;
  payload: unknown;
  processed: boolean;
  receivedAt: string;
}
