export interface ChargeRequest {
  referenceNo: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethodCode: string;
  description: string;
}

export interface ChargeResponse {
  success: boolean;
  referenceNo: string;
  paymentUrl?: string;
  vaNumber?: string;
  qrCodeUrl?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  instructions: string[];
  rawResponse?: any;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  referenceNo: string;
  status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING';
  amount?: number;
  rawPayload: any;
}

export interface PaymentGatewayInterface {
  providerCode: string;
  createCharge(request: ChargeRequest): Promise<ChargeResponse>;
  verifyWebhook(headers: Record<string, any>, payload: any): Promise<WebhookVerificationResult>;
  getPaymentStatus(referenceNo: string): Promise<'WAITING_PAYMENT' | 'SUCCESS' | 'FAILED' | 'EXPIRED'>;
}
