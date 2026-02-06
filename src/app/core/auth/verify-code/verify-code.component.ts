import {
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServices } from '../../services/authServices/auth.services';
import { ToastUtilService } from '../../services/toastrServices/toastr.services';
import { Ierror } from '../../interfaces/errorInterface/ierror.interfaces';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css',
})
export class VerifyCodeComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  verifyCodeForm!: FormGroup;
  authSubscription!: Subscription;
  isLoading: WritableSignal<boolean> = signal(false);
  readonly otpInputsValue: WritableSignal<string> = signal('');
  toastr = inject(ToastUtilService);
  private readonly fb = inject(FormBuilder);
  private authServices = inject(AuthServices);
  private router = inject(Router);
  private plateFormId = inject(PLATFORM_ID);

  ngOnInit() {
    this.initializeForm();
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const inputs = this.otpInputs.toArray();

    if (input.value && index < inputs.length - 1) {
      inputs[index + 1].nativeElement.focus();
    }

    if (event.key === 'Backspace' && !input.value && index > 0) {
      inputs[index - 1].nativeElement.focus();
    }
    this.getOtpCode();
  }

  getOtpCode(): string {
    this.otpInputsValue.set(this.otpInputs.map((input) => input.nativeElement.value).join(''));
    return this.otpInputsValue();
  }

  initializeForm() {
    this.verifyCodeForm = this.fb.group({
      resetCode: ['', [Validators.required]],
    });

    this.otpInputsValue.set('');
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.otpInputsValue().length === 6) {
      this.authSubscription?.unsubscribe();
      this.authSubscription = this.authServices
        .verifyCode({ resetCode: this.otpInputsValue() })
        .subscribe({
          next: (res) => {
            console.log(res);

            this.initializeForm();
            this.isLoading.set(false);
            this.router.navigate(['/reset-password']);
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
      this.toastr.error(`Please enter the 6-digit code`, `Invalid Code`, {
        progressBar: true,
        progressAnimation: 'decreasing',
        timeOut: 6000,
      });
      this.isLoading.set(false);
    }
  }
}
