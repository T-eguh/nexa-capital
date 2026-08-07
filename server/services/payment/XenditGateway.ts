import { PaymentGatewayInterface, ChargeRequest, ChargeResponse, WebhookVerificationResult } from './GatewayInterface';

export class XenditGateway implements PaymentGatewayInterface {
  providerCode = 'XENDIT';

  async createCharge(request: ChargeRequest): Promise<ChargeResponse> {
    const isEwallet = request.paymentMethodCode.startsWith('EWALLET_');
    const ewalletName = request.paymentMethodCode.replace('EWALLET_', '');

    return {
      success: true,
      referenceNo: request.referenceNo,
      paymentUrl: `https://checkout.xendit.co/web/${request.referenceNo}`,
      accountName: 'PT NEXA CAPITAL INDONESIA',
      instructions: [
        `Buka aplikasi E-Wallet ${ewalletName}.`,
        'Tekan notifikasi pembayaran yang masuk atau scan QR payment.',
        `Pastikan saldo mencukupi sejumlah Rp ${request.amount.toLocaleString('id-ID')}`,
        'Konfirmasi PIN E-Wallet Anda untuk menyelesaikan transaksi.'
      ],
      rawResponse: { provider: 'Xendit Invoice Simulator', status: 'PENDING' }
    };
  }

  async verifyWebhook(headers: Record<string, any>, payload: any): Promise<WebhookVerificationResult> {
    const referenceNo = payload.external_id || payload.referenceNo || 'NEXA-DEP-UNKNOWN';
    const statusStr = payload.status || 'PAID';

    let status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING' = 'PENDING';
    if (statusStr === 'PAID' || statusStr === 'COMPLETED') {
      status = 'SUCCESS';
    } else if (statusStr === 'EXPIRED') {
      status = 'EXPIRED';
    } else if (statusStr === 'FAILED') {
      status = 'FAILED';
    }

    return {
      isValid: true,
      referenceNo,
      status,
      amount: payload.amount ? parseFloat(payload.amount) : undefined,
      rawPayload: payload
    };
  }

  async getPaymentStatus(referenceNo: string): Promise<'WAITING_PAYMENT' | 'SUCCESS' | 'FAILED' | 'EXPIRED'> {
    return 'WAITING_PAYMENT';
  }
}
