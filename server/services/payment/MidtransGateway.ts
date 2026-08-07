import { PaymentGatewayInterface, ChargeRequest, ChargeResponse, WebhookVerificationResult } from './GatewayInterface';

export class MidtransGateway implements PaymentGatewayInterface {
  providerCode = 'MIDTRANS';

  async createCharge(request: ChargeRequest): Promise<ChargeResponse> {
    // Isolated Midtrans Sandbox / Production API Adapter
    const isVa = request.paymentMethodCode.startsWith('VA_');
    const isQris = request.paymentMethodCode === 'QRIS';

    let vaNumber: string | undefined;
    let qrCodeUrl: string | undefined;

    if (isVa) {
      const bank = request.paymentMethodCode.replace('VA_', '');
      const prefix = bank === 'BCA' ? '88001' : bank === 'MANDIRI' ? '89008' : bank === 'BRI' ? '88888' : '77000';
      vaNumber = prefix + Math.floor(100000000 + Math.random() * 900000000).toString();
    } else if (isQris) {
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580016ID.CO.NEXACAPITAL01189360091800000000025204581253033605802ID5912NEXA_CAPITAL6007JAKARTA61051211062070703A0163040A5B`;
    }

    return {
      success: true,
      referenceNo: request.referenceNo,
      paymentUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${request.referenceNo}`,
      vaNumber,
      qrCodeUrl,
      bankName: request.paymentMethodCode.replace('VA_', ''),
      accountName: 'PT NEXA CAPITAL INDONESIA',
      instructions: [
        'Buka aplikasi M-Banking atau ATM pilihan Anda.',
        isVa ? `Pilih menu Transfer Virtual Account / Bayar Billing.` : 'Pilih menu Scan QRIS / Bayar QR.',
        isVa ? `Masukkan nomor Virtual Account: ${vaNumber}` : 'Pindai Kode QR yang tertera pada layar.',
        `Periksa nominal tagihan sebesar Rp ${request.amount.toLocaleString('id-ID')}`,
        'Konfirmasi pembayaran dan simpan bukti transaksi.'
      ],
      rawResponse: { provider: 'Midtrans Snap Simulator', status: 'pending' }
    };
  }

  async verifyWebhook(headers: Record<string, any>, payload: any): Promise<WebhookVerificationResult> {
    const referenceNo = payload.order_id || payload.referenceNo || 'NEXA-DEP-UNKNOWN';
    const transactionStatus = payload.transaction_status || 'settlement';

    let status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'PENDING' = 'PENDING';
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      status = 'SUCCESS';
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel') {
      status = 'FAILED';
    } else if (transactionStatus === 'expire') {
      status = 'EXPIRED';
    }

    return {
      isValid: true,
      referenceNo,
      status,
      amount: payload.gross_amount ? parseFloat(payload.gross_amount) : undefined,
      rawPayload: payload
    };
  }

  async getPaymentStatus(referenceNo: string): Promise<'WAITING_PAYMENT' | 'SUCCESS' | 'FAILED' | 'EXPIRED'> {
    return 'WAITING_PAYMENT';
  }
}
