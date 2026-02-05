import { Routes } from '@angular/router';
import { HomeComponent } from './features/pages/home/home.component';
import { AboutUsComponent } from './features/pages/about-us/about-us.component';
import { ProductsComponent } from './features/pages/products/products.component';
import { ProductDetailsComponent } from './features/pages/product-details/product-details.component';
import { SignupComponent } from './core/auth/signup/signup.component';
import { LoginComponent } from './core/auth/login/login.component';
import { guestGuardGuard } from './core/guards/guestGuards/guest-guard-guard';
import { CartComponent } from './features/pages/cart/cart.component';
import { WishlistComponent } from './features/pages/wishlist/wishlist.component';
import { ProfileComponent } from './features/pages/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'products/:_id', component: ProductDetailsComponent, title: 'product details' },
  { path: 'about-us', component: AboutUsComponent, title: 'About US' },
  { path: 'products', component: ProductsComponent, title: 'Products' },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: 'profile', component: ProfileComponent, title: 'Profile' },
  {
    path: 'wishlist',
    component: WishlistComponent,
    title: 'Favorite',
  },
  {
    path: 'register',
    component: SignupComponent,
    title: 'Register',
    canActivate: [guestGuardGuard],
  },
  { path: 'login', component: LoginComponent, title: 'Login', canActivate: [guestGuardGuard] },
];
