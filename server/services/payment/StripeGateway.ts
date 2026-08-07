import { PaymentGatewayInterface, ChargeRequest, ChargeResponse, WebhookVerificationResult } from './GatewayInterface';

export class StripeGateway implements PaymentGatewayInterface {
  providerCode = 'STRIPE';

  async createCharge(request: ChargeRequest): Promise<ChargeResponse> {
    return {
      success: true,
      referenceNo: request.referenceNo,
      paymentUrl: `https://checkout.stripe.com/c/pay/${request.referenceNo}`,
      instructions: [
        'Masukkan nomor kartu kredit/debit Visa, Mastercard, atau JCB Anda.',
        'Isi tanggal kadaluarsa (MM/YY) dan 3 digit CVC di belakang kartu.',
        'Lakukan verifikasi 3D Secure / OTP SMS dari bank penerbit kartu Anda.'
      ],
      rawResponse: { provider: 'Stripe Checkout Simulator', status: 'open' }
    };
  }

  async verifyWebhook(headers: Record<string, any>, payload: any): Promise<WebhookVerificationResult> {
    const referenceNo = payload.data?.object?.client_reference_id || payload.referenceNo || 'NEXA-DEP-UNKNOWN';
    const type = payload.type || 'checkout.session.completed';

    let status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING' = 'PENDING';
    if (type === 'checkout.session.completed' || type === 'payment_intent.succeeded') {
      status = 'SUCCESS';
    } else if (type === 'payment_intent.payment_failed') {
      status = 'FAILED';
    }

    return {
      isValid: true,
      referenceNo,
      status,
      amount: payload.data?.object?.amount_total ? payload.data.object.amount_total / 100 : undefined,
      rawPayload: payload
    };
  }

  async getPaymentStatus(referenceNo: string): Promise<'WAITING_PAYMENT' | 'SUCCESS' | 'FAILED' | 'EXPIRED'> {
    return 'WAITING_PAYMENT';
  }
}
