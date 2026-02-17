import { AuthServices } from './../../../core/services/authServices/auth.services';
import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Ierror } from '../../../core/interfaces/errorInterface/ierror.interfaces';
import { OrderServices } from '../../services/orderServices/order.services';
import { IAllUsers, JWTDecode } from '../../../core/interfaces/authInterface/auth.interface';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { IUserOrder } from '../../../core/interfaces/userOrderInterfaces/iuser-order.interfaces';
import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  private readonly orderServices = inject(OrderServices);
  readonly router = inject(Router);
  private readonly authServices = inject(AuthServices);
  private readonly plate_ID = inject(PLATFORM_ID);
  userData: WritableSignal<JWTDecode> = signal({} as JWTDecode);
  user: WritableSignal<IAllUsers> = signal({} as IAllUsers);
  toastr = inject(ToastUtilService);
  userOrderProducts: WritableSignal<IUserOrder[] | null> = signal(null);

  ngOnInit(): void {
    this.userData.set(this.authServices.decodeUserData() as JWTDecode);
    // this.getUserOrders();
    if (isPlatformBrowser(this.plate_ID)) {
      this.getUserOrders();
    }
  }

  getUserOrders(): void {
    this.orderServices.getUserOrders(this.authServices.decodeUserData()?.id!).subscribe({
      next: (res: IUserOrder[]) => {
        this.userOrderProducts.set(res);
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
}
