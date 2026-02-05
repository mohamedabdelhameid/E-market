import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServices } from '../../services/authServices/auth.services';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ToastUtilService } from '../../services/toastrServices/toastr.services';
import { Ierror } from '../../interfaces/errorInterface/ierror.interfaces';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
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
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
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
    if (this.loginForm.valid) {
      this.authSubscription?.unsubscribe();
      this.authSubscription = this.authServices.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.toastr.success(`Successful login`, 'Success', {
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
      this.loginForm.markAllAsTouched();
    }
  }
}
