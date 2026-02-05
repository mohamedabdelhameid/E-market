import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastUtilService {
  private readonly toastr = inject(ToastrService);
  private readonly plat_ID = inject(PLATFORM_ID);

  success(message: string, title?: string, options?: object) {
    if (isPlatformBrowser(this.plat_ID)) {
      this.toastr.success(message, title, options);
    }
  }

  error(message: string, title?: string, options?: object) {
    if (isPlatformBrowser(this.plat_ID)) {
      this.toastr.error(message, title, options);
    }
  }

  info(message: string, title?: string, options?: object) {
    if (isPlatformBrowser(this.plat_ID)) {
      this.toastr.info(message, title, options);
    }
  }

  warning(message: string, title?: string, options?: object) {
    if (isPlatformBrowser(this.plat_ID)) {
      this.toastr.warning(message, title, options);
    }
  }
}
