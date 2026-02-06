import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ierror } from '../../interfaces/errorInterface/ierror.interfaces';
import { AuthServices } from '../../services/authServices/auth.services';
import { ToastUtilService } from '../../services/toastrServices/toastr.services';

@Component({
  selector: 'app-update-user-data',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './update-user-data.component.html',
  styleUrl: './update-user-data.component.css',
})
export class UpdateUserDataComponent {
  updateDataForm!: FormGroup;
  authSubscription!: Subscription;
  isLoading: WritableSignal<boolean> = signal(false);
  userToken: WritableSignal<string | null> = signal(null);
  toastr = inject(ToastUtilService);
  private readonly fb = inject(FormBuilder);
  private authServices = inject(AuthServices);
  private router = inject(Router);
  private plateFormId = inject(PLATFORM_ID);

  ngOnInit() {
    this.initializeForm();
    this.checkUserFound();
    // if (localStorage.getItem('token')) {
    //   this.userToken.set(localStorage.getItem('token'));
    // } else {
    //   this.userToken.set(null);
    // }
    // console.log(this.userToken());
  }

  checkUserFound() {
    if (localStorage.getItem('token') === null) {
      this.userToken.set(null);
    } else {
      this.userToken.set(localStorage.getItem('token'));
    }
    console.log(this.userToken());
  }

  initializeForm() {
    this.updateDataForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z-_. ]+$/)],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      phone: [
        null,
        [Validators.required, Validators.min(11), Validators.pattern(/^0[0125]{2}[0-9]{8}$/)],
      ],
    });
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.updateDataForm.valid) {
      console.log(this.updateDataForm.value);

      this.authSubscription?.unsubscribe();
      this.authSubscription = this.authServices
        .updateDataUser(this.updateDataForm.value)
        .subscribe({
          next: (res) => {
            this.toastr.success(`Successful update`, 'Success', {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 3000,
            });
            this.isLoading.set(false);
            if (isPlatformBrowser(this.plateFormId)) {
              localStorage.setItem('token', res.token);
            }
            this.authServices.decodeUserData();
            this.initializeForm();
            setTimeout(() => {
              location.href = '/home';
            }, 3000);
          },
          error: (err: Ierror) => {
            this.toastr.error(`${err.statusText}`, `${err.error.errors?.msg}`, {
              progressBar: true,
              progressAnimation: 'decreasing',
              timeOut: 6000,
            });
            this.isLoading.set(false);
          },
        });
    } else {
      this.updateDataForm.markAllAsTouched();
    }
  }
}
