import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Iorder, PaymentOrder } from '../../../core/interfaces/ordersInterfaces/iorder.interfaces';
import { STORED_KEY } from '../../../core/static/static';
import { ApiLink } from '../../../core/environment/links/api-link.environment';
import { Observable } from 'rxjs';
import { IUserOrder } from '../../../core/interfaces/userOrderInterfaces/iuser-order.interfaces';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class OrderServices {
  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  token: WritableSignal<string> = signal('');

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (isPlatformBrowser(this.platformId)) {
      this.token.set(localStorage.getItem(STORED_KEY.token) || '');
    }
  }

  getUserOrders(userId: string): Observable<IUserOrder[]> {
    return this.httpClient.get<IUserOrder[]>(ApiLink.apiLink + `orders/user/${userId}`, {
      headers: { [STORED_KEY.token]: this.token() },
    });
  }

  orderOnlineSession(cartId: string, userData: Iorder): Observable<PaymentOrder> {
    return this.httpClient.post<PaymentOrder>(
      ApiLink.apiLink +
        `orders/checkout-session/${cartId}?url=http://localhost:4200?success_url=http://localhost:4200/my-profile?cancel_url=http://localhost:4200/orders`,
      userData,
      {
        headers: { [STORED_KEY.token]: this.token() },
      },
    );
  }

  orderCOD(cartId: string, userData: Iorder): Observable<PaymentOrder> {
    return this.httpClient.post<PaymentOrder>(ApiLink.apiLink + `orders/${cartId}`, userData, {
      headers: { [STORED_KEY.token]: this.token() },
    });
  }
}
