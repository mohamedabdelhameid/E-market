import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JWTDecode } from '../../../../core/interfaces/authInterface/auth.interface';
import { Ierror } from '../../../../core/interfaces/errorInterface/ierror.interfaces';
import { IUserOrder } from '../../../../core/interfaces/userOrderInterfaces/iuser-order.interfaces';
import { AuthServices } from '../../../../core/services/authServices/auth.services';
import { ToastUtilService } from '../../../../core/services/toastrServices/toastr.services';
import { OrderServices } from '../../../services/orderServices/order.services';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [CurrencyPipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  orderId: WritableSignal<string> = signal('');
  private readonly route = inject(ActivatedRoute);
  private readonly orderServices = inject(OrderServices);
  readonly router = inject(Router);
  private readonly authServices = inject(AuthServices);
  userData: WritableSignal<JWTDecode> = signal({} as JWTDecode);
  toastr = inject(ToastUtilService);
  specificOrderProducts: WritableSignal<IUserOrder[] | null> = signal(null);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.orderId.set(this.route.snapshot.paramMap.get('id') || '');
    this.userData.set((this.authServices.decodeUserData() as JWTDecode) || {});
    this.getUserOrders();
  }

  getUserOrders(): void {
    this.orderServices.getUserOrders(this.userData()?.id).subscribe({
      next: (res: IUserOrder[]) => {
        this.specificOrderProducts.set(res.filter((order) => order._id === this.orderId()));
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
