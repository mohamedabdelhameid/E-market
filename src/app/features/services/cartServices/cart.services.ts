import { inject, Injectable } from '@angular/core';
import { ApiLink } from '../../../core/environment/links/api-link.environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { STORED_KEY } from '../../../core/static/static';
import { RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartServices {
  private readonly httpClient = inject(HttpClient);

  addProductToCart(productId: string): Observable<RootCart> {
    return this.httpClient.post<RootCart>(
      ApiLink.apiLink + 'cart',
      {
        productId: productId,
      },
      {
        headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
      },
    );
  }

  getCartProducts(): Observable<RootCart> {
    return this.httpClient.get<RootCart>(ApiLink.apiLink + 'cart', {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }

  plusCountProduct(productId: string, dataCount: object): Observable<RootCart> {
    return this.httpClient.put<RootCart>(ApiLink.apiLink + `cart/${productId}`, dataCount, {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }

  deleteCartItem(productId: string): Observable<RootCart> {
    return this.httpClient.delete<RootCart>(ApiLink.apiLink + `cart/${productId}`, {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }

  deleteAllCartItems(): Observable<RootCart> {
    return this.httpClient.delete<RootCart>(ApiLink.apiLink + `cart`, {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }
}
