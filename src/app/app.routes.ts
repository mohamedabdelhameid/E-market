import { Routes } from '@angular/router';
import { guestGuardGuard } from './core/guards/guestGuards/guest-guard-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./features/pages/about-us/about-us.component').then((m) => m.AboutUsComponent),
    title: 'About US',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/pages/products/products.component').then((m) => m.ProductsComponent),
    title: 'Products',
  },
  {
    path: 'products/:_id',
    loadComponent: () =>
      import('./features/pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
    title: 'product details',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
  },
  {
    path: 'my-profile',
    loadComponent: () =>
      import('./features/pages/orders & profile/orders.component').then((m) => m.OrdersComponent),
    title: 'My profile',
  },
  {
    path: 'order/:id',
    loadComponent: () =>
      import('./features/pages/orders & profile/order-details/order-details.component').then(
        (m) => m.OrderDetailsComponent,
      ),
    title: 'order details',
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./core/auth/forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent,
      ),
    title: 'Forget Password',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./core/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
    title: 'Reset Password',
  },
  {
    path: 'update-password',
    loadComponent: () =>
      import('./core/auth/update-password/update-password.component').then(
        (m) => m.UpdatePasswordComponent,
      ),
    title: 'Update Password',
  },
  {
    path: 'update-profile',
    loadComponent: () =>
      import('./core/auth/update-user-data/update-user-data.component').then(
        (m) => m.UpdateUserDataComponent,
      ),
    title: 'Update Profile',
  },
  {
    path: 'verify-code',
    loadComponent: () =>
      import('./core/auth/verify-code/verify-code.component').then((m) => m.VerifyCodeComponent),
    title: 'Verify Code',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/pages/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    title: 'Favorite',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/auth/signup/signup.component').then((m) => m.SignupComponent),
    title: 'Register',
    canActivate: [guestGuardGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Login',
    canActivate: [guestGuardGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    pathMatch: 'full',
  },
];
