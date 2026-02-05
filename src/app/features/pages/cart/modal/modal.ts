import { Component, inject, Input, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastUtilService } from '../../../../core/services/toastrServices/toastr.services';
import { Router } from '@angular/router';
import { Ierror } from '../../../../core/interfaces/errorInterface/ierror.interfaces';
import { isPlatformBrowser } from '@angular/common';
import { OrderServices } from '../../../services/orderServices/order.services';
import { AuthServices } from '../../../../core/services/authServices/auth.services';
import { JWTDecode } from '../../../../core/interfaces/authInterface/auth.interface';
import {
  Iorder,
  PaymentOrder,
} from '../../../../core/interfaces/ordersInterfaces/iorder.interfaces';

@Component({
  selector: 'app-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  flag: boolean = false;
  checkoutForm!: FormGroup;
  orderSubscription!: Subscription;
  orderCODSubscription!: Subscription;
  isLoading: WritableSignal<boolean> = signal(false);
  isCODLoading: WritableSignal<boolean> = signal(false);
  userData: WritableSignal<{}> = signal({});
  toastr = inject(ToastUtilService);
  private readonly fb = inject(FormBuilder);
  private orderServices = inject(OrderServices);
  private authServices = inject(AuthServices);
  @Input() cartId!: string;

  open() {
    this.flag = true;
  }
  close(event?: MouseEvent) {
    event?.stopPropagation();
    this.flag = false;
  }

  ngOnInit() {
    this.userData.set((this.authServices.decodeUserData() as JWTDecode) || {});

    this.initializeForm();
  }

  initializeForm() {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: ['', [Validators.required]],
        phone: [
          null,
          [Validators.required, Validators.min(11), Validators.pattern(/^0[0125]{2}[0-9]{8}$/)],
        ],
        city: ['', [Validators.required]],
      }),
    });
  }

  onlinePayment() {
    this.isLoading.set(true);
    if (this.checkoutForm.valid) {
      this.orderSubscription?.unsubscribe();
      this.orderCODSubscription?.unsubscribe();
      this.orderSubscription = this.orderServices
        .orderOnlineSession(this.cartId, this.checkoutForm.value)
        .subscribe({
          next: (res: PaymentOrder) => {
            this.toastr.success(`Successful order`, 'Success', {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 1000,
            });
            this.isLoading.set(false);
            this.initializeForm();
            setTimeout(() => {
              location.href = `${res.session.url}`;
            }, 1200);
          },
          error: (err: Ierror) => {
            this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 6000,
            });
            this.isLoading.set(false);
          },
        });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  CODPayment() {
    this.isCODLoading.set(true);
    if (this.checkoutForm.valid) {
      this.orderSubscription?.unsubscribe();
      this.orderCODSubscription?.unsubscribe();
      this.orderCODSubscription = this.orderServices
        .orderCOD(this.cartId, this.checkoutForm.value)
        .subscribe({
          next: (res: PaymentOrder) => {
            console.log(res);

            this.toastr.success(`Successful order`, 'Success', {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 1000,
            });
            this.isCODLoading.set(false);
            this.initializeForm();
            setTimeout(() => {
              location.href = `/home`;
            }, 1200);
          },
          error: (err: Ierror) => {
            this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 6000,
            });
            this.isCODLoading.set(false);
          },
        });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
