import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iorder, PaymentOrder } from '../../../core/interfaces/ordersInterfaces/iorder.interfaces';
import { STORED_KEY } from '../../../core/static/static';
import { ApiLink } from '../../../core/environment/links/api-link.environment';
import { Observable } from 'rxjs';
import { IUserOrder } from '../../../core/interfaces/userOrderInterfaces/iuser-order.interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrderServices {
  private readonly httpClient = inject(HttpClient);

  getUserOrders(userId: string): Observable<IUserOrder[]> {
    return this.httpClient.get<IUserOrder[]>(ApiLink.apiLink + `orders/user/${userId}`, {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }

  orderOnlineSession(cartId: string, userData: Iorder): Observable<PaymentOrder> {
    return this.httpClient.post<PaymentOrder>(
      ApiLink.apiLink + `orders/checkout-session/${cartId}?url=http://localhost:4200`,
      userData,
      {
        headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
      },
    );
  }

  orderCOD(cartId: string, userData: Iorder): Observable<PaymentOrder> {
    return this.httpClient.post<PaymentOrder>(ApiLink.apiLink + `orders/${cartId}`, userData, {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }
}
