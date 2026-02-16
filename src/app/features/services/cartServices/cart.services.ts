import { inject, Injectable, signal, WritableSignal } from '@angular/core';
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
  cartCount: WritableSignal<number> = signal<number>(0);

  addProductToCart(productId: string): Observable<RootCart> {
    return this.httpClient.post<RootCart>(ApiLink.apiCartLink + 'cart', {
      productId: productId,
    });
  }

  getCartProducts(): Observable<RootCart> {
    return this.httpClient.get<RootCart>(ApiLink.apiCartLink + 'cart');
  }

  plusCountProduct(productId: string, dataCount: object): Observable<RootCart> {
    return this.httpClient.put<RootCart>(ApiLink.apiCartLink + `cart/${productId}`, dataCount);
  }

  deleteCartItem(productId: string): Observable<RootCart> {
    return this.httpClient.delete<RootCart>(ApiLink.apiCartLink + `cart/${productId}`);
  }

  deleteAllCartItems(): Observable<RootCart> {
    return this.httpClient.delete<RootCart>(ApiLink.apiCartLink + `cart`);
  }
}
