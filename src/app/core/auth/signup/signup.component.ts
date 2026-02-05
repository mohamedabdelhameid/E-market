import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServices } from '../../services/authServices/auth.services';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ToastUtilService } from '../../services/toastrServices/toastr.services';
import { Ierror } from '../../interfaces/errorInterface/ierror.interfaces';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  registerForm!: FormGroup;
  authSubscription!: Subscription;
  isLoading: WritableSignal<boolean> = signal(false);
  toastr = inject(ToastUtilService);
  private readonly fb = inject(FormBuilder);
  private authServices = inject(AuthServices);
  private router = inject(Router);
  private plateFormId = inject(PLATFORM_ID);
  // private decodeUserData = inject(decodeUserData);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group(
      {
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
      document.getElementById('password')!.setAttribute('type', 'text');
      document.getElementById('rePassword')!.setAttribute('type', 'text');
    } else {
      document.getElementById('password')!.setAttribute('type', 'password');
      document.getElementById('rePassword')!.setAttribute('type', 'password');
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.registerForm.valid) {
      this.authSubscription?.unsubscribe();
      this.authSubscription = this.authServices.addUser(this.registerForm.value).subscribe({
        next: (res) => {
          this.toastr.success(`${res.message}`, 'Success', {
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
      this.registerForm.markAllAsTouched();
    }
  }
}
