import { Component, inject, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { CartServices } from '../../services/cartServices/cart.services';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { Cart, RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';
import { isPlatformBrowser, JsonPipe } from '@angular/common';
import { Ierror } from '../../../core/interfaces/errorInterface/ierror.interfaces';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/authServices/auth.services';
import { Modal } from './modal/modal';
@Component({
  selector: 'app-cart',
  imports: [Modal],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private readonly cartServices = inject(CartServices);
  private readonly platform_id = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  toastr = inject(ToastUtilService);
  cartProducts: WritableSignal<Cart | null> = signal(null);
  isLogedIn: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  plusLoading: WritableSignal<boolean> = signal(false);
  minLoading: WritableSignal<boolean> = signal(false);
  deleteLoading: WritableSignal<boolean> = signal(false);
  deleteAllLoading: WritableSignal<boolean> = signal(false);
  myToken: WritableSignal<string> = signal('');
  private readonly authServices = inject(AuthServices);
  selected: WritableSignal<string | null> = signal(null);
  @ViewChild(Modal) modal!: Modal;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (isPlatformBrowser(this.platform_id)) {
      this.checkLogedIn();
    }
    this.getCartProducts();
  }

  checkLogedIn(): void {
    if (localStorage.getItem('token')) {
      this.isLogedIn.set(true);
      this.myToken.set(localStorage.getItem('token')!);
    } else {
      this.isLogedIn.set(false);
      this.myToken.set('');
    }
  }

  getCartProducts(): void {
    this.cartServices.getCartProducts().subscribe({
      next: (res: RootCart) => {
        this.cartProducts.set(res.data);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      },
    });
  }

  updateQuantity(productId: string, count: object): void {
    this.isLoading.set(true);
    this.selected.set(productId);
    this.cartServices.plusCountProduct(productId, count).subscribe({
      next: (res: RootCart) => {
        this.cartProducts.set(res.data);

        this.isLoading.set(false);
        this.minLoading.set(false);
        this.plusLoading.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
        this.isLoading.set(false);
        this.minLoading.set(false);
        this.plusLoading.set(false);
      },
    });
  }

  plusQuantity(itemId: string, quantity: object) {
    this.updateQuantity(itemId, quantity);
    this.plusLoading.set(true);
    this.minLoading.set(false);
  }
  minQuantity(itemId: string, quantity: object) {
    this.updateQuantity(itemId, quantity);
    this.minLoading.set(true);
    this.plusLoading.set(false);
  }

  deleteProductFormCart(productId: string): void {
    this.deleteLoading.set(true);
    this.selected.set(productId);
    this.cartServices.deleteCartItem(productId).subscribe({
      next: (res: RootCart) => {
        this.cartProducts.set(res.data);

        this.deleteLoading.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
        this.deleteLoading.set(false);
      },
    });
  }

  deleteAllProductsFromCart(): void {
    this.deleteAllLoading.set(true);
    this.cartServices.deleteAllCartItems().subscribe({
      next: (res: RootCart) => {
        this.cartProducts.set(res.data);

        this.deleteAllLoading.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
        this.deleteAllLoading.set(false);
      },
    });
  }

  openModal() {
    this.modal.open();
  }
  closeModal() {
    this.modal.close();
  }

  checkoutFn(): void {
    this.openModal();
  }
}
