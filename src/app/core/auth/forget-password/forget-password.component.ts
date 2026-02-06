import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServices } from '../../services/authServices/auth.services';
import { ToastUtilService } from '../../services/toastrServices/toastr.services';
import { Ierror } from '../../interfaces/errorInterface/ierror.interfaces';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  forgitPasswordForm!: FormGroup;
  authSubscription!: Subscription;
  isLoading: WritableSignal<boolean> = signal(false);
  toastr = inject(ToastUtilService);
  private readonly fb = inject(FormBuilder);
  private authServices = inject(AuthServices);
  private router = inject(Router);
  private plateFormId = inject(PLATFORM_ID);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.forgitPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
    });
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.forgitPasswordForm.valid) {
      this.authSubscription?.unsubscribe();
      this.authSubscription = this.authServices
        .forgetPassword(this.forgitPasswordForm.value)
        .subscribe({
          next: (res) => {
            this.initializeForm();
            this.isLoading.set(false);
            this.router.navigate(['/verify-code']);
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
      this.forgitPasswordForm.markAllAsTouched();
    }
  }
}
