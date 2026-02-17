import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  PLATFORM_ID,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';
import { Ierror } from '../../../core/interfaces/errorInterface/ierror.interfaces';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { CartServices } from '../../../features/services/cartServices/cart.services';
import { Iproduct } from '../../../core/interfaces/products/iproduct.interface';
import { WishlistServices } from '../../../features/services/wishlistServices/wishlist.services';
import { Daum, Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';

@Component({
  selector: 'app-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  toastr = inject(ToastUtilService);
  private readonly cartServices = inject(CartServices);
  private readonly plate_ID = inject(PLATFORM_ID);
  isLoading: WritableSignal<boolean> = signal(false);
  selected: WritableSignal<string | null> = signal(null);
  addProductLoading: WritableSignal<boolean> = signal(false);
  item = input<Iproduct>();
  private readonly wishlistServices = inject(WishlistServices);
  isLoadingWishList: WritableSignal<boolean> = signal(false);

  selectedWishlist: WritableSignal<string | null> = signal(null);
  added: WritableSignal<boolean> = signal(false);

  productFounded = computed(() =>
    this.wishlistServices.wishListProduct().some((product) => product.id === this.item()?.id),
  );

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (isPlatformBrowser(this.plate_ID)) {
      if (localStorage.getItem('token')) {
        this.checkIfProductInWishlist();
      }
    }
  }

  checkIfProductInWishlist() {
    this.productFounded = computed(() =>
      this.wishlistServices.wishListProduct().some((product) => product.id === this.item()?.id),
    );
  }

  addProductToCart(productId: string): void {
    this.selected.set(productId);
    this.addProductLoading.set(true);
    this.cartServices.addProductToCart(productId).subscribe({
      next: (res: RootCart) => {
        this.cartServices.cartCount.set(res.numOfCartItems);
        this.toastr.success(`${res.message}`, `Success`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.addProductLoading.set(false);
      },
      error: (err: Ierror) => {
        if (err.status === 401) {
          this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
        }
        this.addProductLoading.set(false);
      },
    });
  }

  addProductToWishlist(productId: string): void {
    this.selectedWishlist.set(productId);
    this.isLoadingWishList.set(true);
    if (this.productFounded()) {
      this.wishlistServices.removeProductFromWishlist(productId).subscribe({
        next: (res: Iwishlist) => {
          this.toastr.warning(`Successfully removed from favorite`, `${res.status}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
          this.checkIfProductInWishlist();
          this.wishlistServices.getWishlistProducts().subscribe();

          // this.wishlistServices.wishListProduct.set(res.data);
          this.wishlistServices.wishlistCount.set(res.data.length);
          this.isLoadingWishList.set(false);
        },
        error: (err: Ierror) => {
          if (err.status === 401) {
            this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 3000,
            });
            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
          } else {
            this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 3000,
            });
          }
          this.isLoadingWishList.set(false);
        },
      });
    } else {
      this.wishlistServices.addProductToWishlist(productId).subscribe({
        next: (res: Iwishlist) => {
          this.toastr.success(`Successfully added to favorite`, `${res.status}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
          this.checkIfProductInWishlist();
          this.wishlistServices.getWishlistProducts().subscribe();

          this.wishlistServices.wishlistCount.set(res.data.length);
          // this.wishlistServices.wishListProduct.set(res.data);

          this.isLoadingWishList.set(false);
          this.added.set(true);
        },
        error: (err: Ierror) => {
          if (err.status === 401) {
            this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 3000,
            });
            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
          } else {
            this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 3000,
            });
          }
          this.isLoadingWishList.set(false);
          this.added.set(false);
        },
      });
    }
  }
}
