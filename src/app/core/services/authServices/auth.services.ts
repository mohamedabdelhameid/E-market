import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLink } from '../../environment/links/api-link.environment';
import {
  SignUpAuth,
  UserRoot,
  User,
  ILogin,
  JWTDecode,
  UpdatePassword,
  IAllUsers,
} from '../../interfaces/authInterface/auth.interface';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { STORED_KEY } from '../../static/static';
import { Igest } from '../../interfaces/gestInterfaces/igest.interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private readonly httpClient = inject(HttpClient);
  private platformID = inject(PLATFORM_ID);
  private router = inject(Router);
  tokenKey: WritableSignal<string | null> = signal(null);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.decodeUserData();
  }

  getToken() {
    this.tokenKey.set(localStorage.getItem(STORED_KEY.token));
    console.log(this.tokenKey);
  }

  getAllUsers(): Observable<UserRoot<IAllUsers[]>> {
    return this.httpClient.get<UserRoot<IAllUsers[]>>(ApiLink.apiLink + 'users');
  }

  addUser(userData: SignUpAuth): Observable<UserRoot<User>> {
    return this.httpClient.post<UserRoot<User>>(ApiLink.apiLink + 'auth/signup', userData);
  }

  login(userData: ILogin): Observable<UserRoot<User>> {
    return this.httpClient.post<UserRoot<User>>(ApiLink.apiLink + 'auth/signin', userData);
  }

  forgetPassword(userData: { email: string }): Observable<Igest> {
    return this.httpClient.post<Igest>(ApiLink.apiLink + 'auth/forgotPasswords', userData);
  }

  verifyCode(userData: { resetCode: string }): Observable<Igest> {
    return this.httpClient.post<Igest>(ApiLink.apiLink + 'auth/verifyResetCode', userData);
  }

  resetCode(userData: { email: string; newPassword: string }): Observable<{ token: string }> {
    return this.httpClient.put<{ token: string }>(ApiLink.apiLink + 'auth/resetPassword', userData);
  }

  updatePassword(userData: UpdatePassword): Observable<UserRoot<User>> {
    return this.httpClient.put<UserRoot<User>>(
      ApiLink.apiLink + 'users/changeMyPassword',
      userData,
      {
        headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
      },
    );
  }

  updateDataUser(userData: User): Observable<UserRoot<User>> {
    return this.httpClient.put<UserRoot<User>>(ApiLink.apiLink + 'users/updateMe', userData, {
      headers: { [STORED_KEY.token]: localStorage.getItem(STORED_KEY.token) || '' },
    });
  }

  decodeUserData(): JWTDecode | undefined {
    if (isPlatformBrowser(this.platformID)) {
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token')!;
        const decoded = jwtDecode(token) as JWTDecode;
        return decoded;
      } else {
        this.router.navigate(['/login']);
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}
