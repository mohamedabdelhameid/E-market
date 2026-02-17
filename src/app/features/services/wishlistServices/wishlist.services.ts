import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiLink } from '../../../core/environment/links/api-link.environment';
import { Daum, Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WishlistServices {
  private readonly httpClient = inject(HttpClient);
  wishlistCount: WritableSignal<number> = signal<number>(0);
  wishListProduct: WritableSignal<Daum[]> = signal([]);

  getWishlistProducts(): Observable<Iwishlist> {
    return this.httpClient.get<Iwishlist>(ApiLink.apiLink + 'wishlist').pipe(
      tap((res) => {
        this.wishListProduct.set(res.data);
        this.wishlistCount.set(res.count);
      }),
    );
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
