import { Component, inject, input, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';
import { Ierror } from '../../../core/interfaces/errorInterface/ierror.interfaces';
import { Iproduct } from '../../../core/interfaces/products/iproduct.interface';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { CartServices } from '../../services/cartServices/cart.services';
import { WishlistServices } from '../../services/wishlistServices/wishlist.services';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [CardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  wishlistProducts: WritableSignal<Iproduct[]> = signal([]);

  toastr = inject(ToastUtilService);
  private readonly wishlistServices = inject(WishlistServices);
  private readonly plate_ID = inject(PLATFORM_ID);

  isLoadingWishList: WritableSignal<boolean> = signal(false);

  selectedWishlist: WritableSignal<string | null> = signal(null);

  addWishlistProductLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (isPlatformBrowser(this.plate_ID)) {
      if (localStorage.getItem('token')) {
        this.getWishlistProducts();
      }
    }
  }

  getWishlistProducts(): void {
    this.isLoadingWishList.set(true);
    // Call the service to get wishlist products and update the signal
    this.wishlistServices.getWishlistProducts().subscribe({
      next: (res: Iwishlist) => {
        this.wishlistServices.wishListProduct.set(res.data);
        this.wishlistProducts.set(this.wishlistServices.wishListProduct());
        this.wishlistServices.wishlistCount.set(res.count);

        this.isLoadingWishList.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.isLoadingWishList.set(false);
      },
    });
  }
}
