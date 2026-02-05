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
} from '../../interfaces/authInterface/auth.interface';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { STORED_KEY } from '../../static/static';
import { Igest } from '../../interfaces/gestInterfaces/igest.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private readonly httpClient = inject(HttpClient);
  private platformID = inject(PLATFORM_ID);
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

  addUser(userData: SignUpAuth): Observable<UserRoot<User>> {
    return this.httpClient.post<UserRoot<User>>(ApiLink.apiLink + 'auth/signup', userData);
  }

  login(userData: ILogin): Observable<UserRoot<User>> {
    return this.httpClient.post<UserRoot<User>>(ApiLink.apiLink + 'auth/signin', userData);
  }

  decodeUserData(): JWTDecode | undefined {
    if (isPlatformBrowser(this.platformID)) {
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token')!;
        const decoded = jwtDecode(token) as JWTDecode;
        return decoded;
      }
    }
    return undefined;
  }
}
