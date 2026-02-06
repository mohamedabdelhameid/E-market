import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServices } from '../../services/authServices/auth.services';
import { ToastUtilService } from '../../services/toastrServices/toastr.services';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Ierror } from '../../interfaces/errorInterface/ierror.interfaces';

@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent {
  updatePasswordForm!: FormGroup;
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
    console.log(this.userToken());
  }

  initializeForm() {
    this.updatePasswordForm = this.fb.group(
      {
        currentPassword: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*^])[A-Za-z\d!@#$%&*^]{7,}$/),
          ],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*^])[A-Za-z\d!@#$%&*^]{7,}$/),
          ],
        ],
        rePassword: [null, [Validators.required]],
      },
      { validators: this.confirmPassword },
    );
  }

  confirmPassword(group: FormGroup) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(event: Event) {
    if ((event.target as HTMLInputElement).checked === true) {
      document.getElementById('currentPassword')!.setAttribute('type', 'text');
      document.getElementById('password')!.setAttribute('type', 'text');
      document.getElementById('rePassword')!.setAttribute('type', 'text');
    } else {
      document.getElementById('currentPassword')!.setAttribute('type', 'password');
      document.getElementById('password')!.setAttribute('type', 'password');
      document.getElementById('rePassword')!.setAttribute('type', 'password');
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.updatePasswordForm.valid) {
      this.authSubscription?.unsubscribe();
      this.authSubscription = this.authServices
        .updatePassword(this.updatePasswordForm.value)
        .subscribe({
          next: (res) => {
            console.log(res);

            this.toastr.success(`Successful password update`, 'Success', {
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
            if (err.status === 401) {
              this.toastr.error(`Your session has expired. Please log in again.`, `Unauthorized`, {
                progressBar: true,
                progressAnimation: 'decreasing',
                timeOut: 6000,
              });
              this.router.navigate(['/login']);
            } else {
              this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
                progressBar: true,
                progressAnimation: 'decreasing',
                timeOut: 6000,
              });
            }
          },
        });
    } else {
      this.updatePasswordForm.markAllAsTouched();
    }
  }
}
