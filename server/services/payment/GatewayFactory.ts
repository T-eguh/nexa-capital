import { PaymentGatewayInterface } from './GatewayInterface';
import { MidtransGateway } from './MidtransGateway';
import { XenditGateway } from './XenditGateway';
import { StripeGateway } from './StripeGateway';
import { ManualGateway } from './ManualGateway';

export class GatewayFactory {
  private static gateways: Record<string, PaymentGatewayInterface> = {
    MIDTRANS: new MidtransGateway(),
    XENDIT: new XenditGateway(),
    STRIPE: new StripeGateway(),
    MANUAL: new ManualGateway(),
    CRYPTO: new ManualGateway(),
  };

  static getGateway(providerCode: string): PaymentGatewayInterface {
    const gateway = this.gateways[providerCode.toUpperCase()];
    if (!gateway) {
      return this.gateways['MIDTRANS'];
    }
    return gateway;
  }
}
