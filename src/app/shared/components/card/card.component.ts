import { CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  Input,
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
import { Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';

@Component({
  selector: 'app-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  toastr = inject(ToastUtilService);
  private readonly cartServices = inject(CartServices);
  isLoading: WritableSignal<boolean> = signal(false);
  selected: WritableSignal<string | null> = signal(null);
  addProductLoading: WritableSignal<boolean> = signal(false);
  item = input<Iproduct>();
  private readonly wishlistServices = inject(WishlistServices);
  isLoadingWishList: WritableSignal<boolean> = signal(false);
  selectedWishlist: WritableSignal<string | null> = signal(null);
  // addWishlistProductLoading: WritableSignal<boolean> = signal(false);
  // removeWishlistProductLoading: WritableSignal<boolean> = signal(false);
  wishlistProducts: WritableSignal<Iproduct[]> = signal([]);
  // productFounded: WritableSignal<boolean> = signal(false);
  productFounded!: Signal<boolean>;
  added: WritableSignal<boolean> = signal(false);

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.checkFounded();
  }

  checkFounded(): void {
    this.productFounded = computed(() =>
      this.wishlistProducts().some((product) => product.id === this.item()?.id),
    );
  }

  addProductToCart(productId: string): void {
    this.selected.set(productId);

    this.addProductLoading.set(true);
    this.cartServices.addProductToCart(productId).subscribe({
      next: (res: RootCart) => {
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
        // this.checkIfFounded();

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

  addProductToWishlist(productId: string): void {
    this.selectedWishlist.set(productId);
    // this.added.set(false);
    this.isLoadingWishList.set(true);
    if (this.productFounded()) {
      // this.removeProductFromWishlist(productId);
      this.wishlistServices.removeProductFromWishlist(productId).subscribe({
        next: (res: Iwishlist) => {
          this.toastr.warning(`Successfully removed from favorite`, `${res.status}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
          this.wishlistProducts.set(res.data);
          // this.getWishlistProducts();
          // this.checkIfFounded();
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
      // this.getWishlistProducts();
      // this.isLoadingWishList.set(false);
    } else {
      this.isLoadingWishList.set(true);
      this.added.set(true);

      this.wishlistServices.addProductToWishlist(productId).subscribe({
        next: (res: Iwishlist) => {
          this.toastr.success(`Successfully added to favorite`, `${res.status}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
          this.wishlistProducts.set(res.data);
          this.isLoadingWishList.set(false);
          // this.checkIfFounded();

          // this.getWishlistProducts();
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

  // removeProductFromWishlist(productId: string): void {
  //   this.selectedWishlist.set(productId);
  //   // this.removed.set(false);
  //   this.isLoadingWishList.set(true);
  //   this.wishlistServices.removeProductFromWishlist(productId).subscribe({
  //     next: (res: Iwishlist) => {
  //       this.toastr.warning(`Successfully removed from favorite`, `${res.status}`, {
  //         progressBar: true,
  //         progressAnimation: 'decreasing',
  //         timeOut: 3000,
  //       });
  //       this.wishlistProducts.set(res.data);
  //       // this.getWishlistProducts();
  //       // this.checkIfFounded();
  //       this.isLoadingWishList.set(false);
  //     },
  //     error: (err: Ierror) => {
  //       if (err.status === 401) {
  //         this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
  //           progressBar: true,
  //           progressAnimation: 'decreasing',
  //           timeOut: 3000,
  //         });
  //         setTimeout(() => {
  //           window.location.href = '/login';
  //         }, 3000);
  //       } else {
  //         this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
  //           progressBar: true,
  //           progressAnimation: 'decreasing',
  //           timeOut: 3000,
  //         });
  //       }
  //       this.isLoadingWishList.set(false);
  //     },
  //   });
  // }
}
