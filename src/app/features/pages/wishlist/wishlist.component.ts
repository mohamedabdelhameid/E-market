import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';
import { Ierror } from '../../../core/interfaces/errorInterface/ierror.interfaces';
import { Iproduct } from '../../../core/interfaces/products/iproduct.interface';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { CartServices } from '../../services/cartServices/cart.services';
import { WishlistServices } from '../../services/wishlistServices/wishlist.services';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';

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

  isLoadingWishList: WritableSignal<boolean> = signal(false);

  selectedWishlist: WritableSignal<string | null> = signal(null);

  addWishlistProductLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getWishlistProducts();
  }

  getWishlistProducts(): void {
    this.isLoadingWishList.set(true);
    // Call the service to get wishlist products and update the signal
    this.wishlistServices.getWishlistProducts().subscribe({
      next: (res: Iwishlist) => {
        this.wishlistProducts.set(res.data);

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
