import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformID = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformID)) {
    if (localStorage.getItem('token')) {
      return router.parseUrl('/home');
    }
  }

  return true;
};
