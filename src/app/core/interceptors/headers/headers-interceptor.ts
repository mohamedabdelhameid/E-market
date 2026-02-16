import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { STORED_KEY } from '../../static/static';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  let plate_id = inject(PLATFORM_ID);

  if (isPlatformBrowser(plate_id)) {
    const token = localStorage.getItem(STORED_KEY.token);
    if (token) {
      if (
        req.url.includes('orders') ||
        req.url.includes('users') ||
        req.url.includes('auth/verifyToken') ||
        req.url.includes('wishlist') ||
        req.url.includes('cart')
      ) {
        req = req.clone({
          setHeaders: {
            token: token,
          },
        });
      }
    }
  }
  return next(req);
};
