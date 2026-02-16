import { WishlistServices } from './../../../features/services/wishlistServices/wishlist.services';
import { AuthServices } from './../../../core/services/authServices/auth.services';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JWTDecode } from '../../../core/interfaces/authInterface/auth.interface';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { CartServices } from '../../../features/services/cartServices/cart.services';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: WritableSignal<boolean> = signal(false);
  private platformID = inject(PLATFORM_ID);
  authServices = inject(AuthServices);
  userDataDecoded: WritableSignal<JWTDecode | undefined> = signal(undefined);
  toastr = inject(ToastUtilService);
  private cartServices = inject(CartServices);
  private wishlistServices = inject(WishlistServices);
  countCart: Signal<number> = computed(() => this.cartServices.cartCount());
  wishlistCount: Signal<number> = computed(() => this.wishlistServices.wishlistCount());

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.checkUserLogin();
  }

  checkUserLogin() {
    if (isPlatformBrowser(this.platformID)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn.set(true);
        this.getCartCount();
        this.getWishlistCount();
      } else {
        this.isLoggedIn.set(false);
      }
    }
  }

  getCartCount() {
    this.cartServices.getCartProducts().subscribe({
      next: (res) => {
        this.cartServices.cartCount.set(res.numOfCartItems);
      },
    });
  }

  getWishlistCount() {
    this.wishlistServices.getWishlistProducts().subscribe({
      next: (res) => {
        this.wishlistServices.wishlistCount.set(res.count);
      },
    });
  }

  signOut() {
    if (isPlatformBrowser(this.platformID)) {
      localStorage.removeItem('token');
      this.isLoggedIn.set(false);
      this.toastr.warning(`You have been signed out.window refresh after 3 seconds.`, `warning`, {
        progressBar: true,
        progressAnimation: 'decreasing',
        timeOut: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }
}
