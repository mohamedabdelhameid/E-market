import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ierror } from '../../interfaces/errorInterface/ierror.interfaces';
import { AuthServices } from '../../services/authServices/auth.services';
import { ToastUtilService } from '../../services/toastrServices/toastr.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
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
  }

  checkUserFound() {
    if (localStorage.getItem('token') === null) {
      this.userToken.set(null);
    } else {
      this.userToken.set(localStorage.getItem('token'));
    }
  }

  initializeForm() {
    this.resetPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      newPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*^])[A-Za-z\d!@#$%&*^]{7,}$/),
        ],
      ],
    });
  }

  togglePasswordVisibility(event: Event) {
    if ((event.target as HTMLInputElement).checked === true) {
      document.getElementById('password')!.setAttribute('type', 'text');
    } else {
      document.getElementById('password')!.setAttribute('type', 'password');
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.resetPasswordForm.valid) {
      this.authSubscription?.unsubscribe();
      this.authSubscription = this.authServices.resetCode(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          this.toastr.success(`Successful reset password`, 'Success', {
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
          this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 6000,
          });
          this.isLoading.set(false);
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}
