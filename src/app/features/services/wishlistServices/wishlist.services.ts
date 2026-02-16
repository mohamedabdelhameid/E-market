import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLink } from '../../../core/environment/links/api-link.environment';
import { Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WishlistServices {
  private readonly httpClient = inject(HttpClient);
  wishlistCount: WritableSignal<number> = signal<number>(0);

  getWishlistProducts(): Observable<Iwishlist> {
    return this.httpClient.get<Iwishlist>(ApiLink.apiLink + 'wishlist');
  }

  addProductToWishlist(productId: string): Observable<Iwishlist> {
    return this.httpClient.post<Iwishlist>(ApiLink.apiLink + 'wishlist', {
      productId: productId,
    });
  }

  removeProductFromWishlist(productId: string): Observable<Iwishlist> {
    return this.httpClient.delete<Iwishlist>(ApiLink.apiLink + `wishlist/${productId}`);
  }
}
