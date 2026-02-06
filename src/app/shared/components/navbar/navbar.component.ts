import { AuthServices } from './../../../core/services/authServices/auth.services';
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JWTDecode } from '../../../core/interfaces/authInterface/auth.interface';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: WritableSignal<boolean> = signal(false);
  private platformID = inject(PLATFORM_ID);
  private authServices = inject(AuthServices);
  userDataDecoded: WritableSignal<JWTDecode | undefined> = signal(undefined);
  toastr = inject(ToastUtilService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.checkUserLogin();
    // this.getUserData();
  }

  checkUserLogin() {
    if (isPlatformBrowser(this.platformID)) {
      const token = localStorage.getItem('token')!;
      if (token) {
        this.isLoggedIn.set(true);
      } else {
        this.isLoggedIn.set(false);
      }
    }
  }

  // getUserData() {
  //   this.userDataDecoded.set(this.authServices.decodeUserData());
  // }

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
