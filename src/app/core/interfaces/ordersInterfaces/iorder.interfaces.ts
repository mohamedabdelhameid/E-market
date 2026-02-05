export interface Iorder {
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface PaymentOrder {
  status: string;
  session: Session;
}

export interface Session {
  url: string;
  success_url: string;
  cancel_url: string;
}
