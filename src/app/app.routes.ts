import { NotFoundComponent } from './features/pages/not-found/not-found.component';
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
import { OrdersComponent } from './features/pages/orders & profile/orders.component';
import { OrderDetailsComponent } from './features/pages/orders & profile/order-details/order-details.component';
import { ForgetPasswordComponent } from './core/auth/forget-password/forget-password.component';
import { VerifyCodeComponent } from './core/auth/verify-code/verify-code.component';
import { ResetPasswordComponent } from './core/auth/reset-password/reset-password.component';
import { UpdatePasswordComponent } from './core/auth/update-password/update-password.component';
import { UpdateUserDataComponent } from './core/auth/update-user-data/update-user-data.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'about-us', component: AboutUsComponent, title: 'About US' },
  { path: 'products', component: ProductsComponent, title: 'Products' },
  { path: 'products/:_id', component: ProductDetailsComponent, title: 'product details' },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: 'my-profile', component: OrdersComponent, title: 'My profile' },
  { path: 'order/:id', component: OrderDetailsComponent, title: 'order details' },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    title: 'Forget Password',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password',
  },
  {
    path: 'update-password',
    component: UpdatePasswordComponent,
    title: 'Update Password',
  },
  {
    path: 'update-profile',
    component: UpdateUserDataComponent,
    title: 'Update Profile',
  },
  {
    path: 'verify-code',
    component: VerifyCodeComponent,
    title: 'Verify Code',
  },
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
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
