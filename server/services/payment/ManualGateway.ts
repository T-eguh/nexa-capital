import { PaymentGatewayInterface, ChargeRequest, ChargeResponse, WebhookVerificationResult } from './GatewayInterface';

export class ManualGateway implements PaymentGatewayInterface {
  providerCode = 'MANUAL';

  async createCharge(request: ChargeRequest): Promise<ChargeResponse> {
    const isCrypto = request.paymentMethodCode === 'CRYPTO_USDT';

    if (isCrypto) {
      return {
        success: true,
        referenceNo: request.referenceNo,
        accountNumber: 'TQn9Y2kh5B4y9Y8kP1xZ9xL7M9K2aB3cD4',
        bankName: 'USDT (TRC20)',
        accountName: 'Nexa Capital Wallet Vault',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TQn9Y2kh5B4y9Y8kP1xZ9xL7M9K2aB3cD4',
        instructions: [
          'Transfer USDT menggunakan jaringan TRC-20 (Tron Network).',
          'Alamat Wallet: TQn9Y2kh5B4y9Y8kP1xZ9xL7M9K2aB3cD4',
          `Nominal Est. USD: $${(request.amount / 15800).toFixed(2)}`,
          'Unggah foto resi atau screenshot TxHash setelah melakukan pengiriman.'
        ]
      };
    }

    return {
      success: true,
      referenceNo: request.referenceNo,
      accountNumber: '122-00-0988776-5',
      bankName: 'Bank Mandiri Corporate',
      accountName: 'PT NEXA CAPITAL INDONESIA',
      instructions: [
        'Lakukan transfer bank ke rekening PT NEXA CAPITAL INDONESIA.',
        'Bank Mandiri: 122-00-0988776-5',
        `Sertakan Kode Referensi "${request.referenceNo}" di berita transfer.`,
        'Unggah buki transfer / resi transaksi pada form deposit agar dapat diverifikasi oleh tim Finance.'
      ]
    };
  }

  async verifyWebhook(headers: Record<string, any>, payload: any): Promise<WebhookVerificationResult> {
    return {
      isValid: true,
      referenceNo: payload.referenceNo || 'NEXA-DEP-UNKNOWN',
      status: payload.status || 'PENDING',
      rawPayload: payload
    };
  }

  async getPaymentStatus(referenceNo: string): Promise<'WAITING_PAYMENT' | 'SUCCESS' | 'FAILED' | 'EXPIRED'> {
    return 'WAITING_PAYMENT';
  }
}
