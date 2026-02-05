import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLink } from '../../../core/environment/links/api-link.environment';
import { RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';
import { STORED_KEY } from '../../../core/static/static';
import { Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WishlistServices {
  private readonly httpClient = inject(HttpClient);

  getWishlistProducts(): Observable<Iwishlist> {
    return this.httpClient.get<Iwishlist>(ApiLink.apiLink + 'wishlist', {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }

  addProductToWishlist(productId: string): Observable<Iwishlist> {
    return this.httpClient.post<Iwishlist>(
      ApiLink.apiLink + 'wishlist',
      {
        productId: productId,
      },
      {
        headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
      },
    );
  }

  removeProductFromWishlist(productId: string): Observable<Iwishlist> {
    return this.httpClient.delete<Iwishlist>(ApiLink.apiLink + `wishlist/${productId}`, {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }
}
