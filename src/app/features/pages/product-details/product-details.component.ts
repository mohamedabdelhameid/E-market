import { ActivatedRoute } from '@angular/router';
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ProductDetailServices } from '../../../core/services/product-details/product-detail.services';
import { IProductDetail } from '../../../core/interfaces/product-details/product-detail.interface';
import { CurrencyPipe } from '@angular/common';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { CartServices } from '../../services/cartServices/cart.services';
import { RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';
import { Ierror } from '../../../core/interfaces/errorInterface/ierror.interfaces';
import { Iproduct } from '../../../core/interfaces/products/iproduct.interface';
import { Iwishlist } from '../../../core/interfaces/wishlistInterfaces/iwishlist.interfaces';
import { WishlistServices } from '../../services/wishlistServices/wishlist.services';
import { HomeProductsComponent } from '../home/home-products/home-products.component';
import { HomeBrandingComponent } from '../home/home-branding/home-branding.component';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, HomeProductsComponent, HomeBrandingComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailServices = inject(ProductDetailServices);
  productId: WritableSignal<string | null> = signal('');
  productDetail: WritableSignal<IProductDetail | null> = signal(null);
  toastr = inject(ToastUtilService);
  addProductLoading: WritableSignal<boolean> = signal(false);
  private readonly cartServices = inject(CartServices);
  private readonly wishlistServices = inject(WishlistServices);
  isLoadingWishList: WritableSignal<boolean> = signal(false);
  selectedWishlist: WritableSignal<string | null> = signal(null);
  selectedImgCover: WritableSignal<string | null> = signal(null);
  wishlistProducts: WritableSignal<Iproduct[]> = signal([]);
  productFounded!: Signal<boolean>;
  added: WritableSignal<boolean> = signal(false);

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.checkFounded();
  }
  checkFounded(): void {
    this.productFounded = computed(() =>
      this.wishlistProducts().some((product) => product.id === this.productId()),
    );
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProductId();
  }

  getProductId() {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.productId.set(res.get('_id'));
        this.getProductDetails(this.productId()!);
      },
    });
  }

  getProductDetails(id: string): void {
    this.productDetailServices.getProductDetails(id).subscribe({
      next: (res: { data: IProductDetail }) => {
        this.productDetail.set(res.data);
        this.getWishlistProducts();
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
      },
    });
  }

  addProductToCart(productId: string): void {
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

  changeImgCover(pathImg: string): void {
    this.selectedImgCover.set(pathImg);
  }
}
