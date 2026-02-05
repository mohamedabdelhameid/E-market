import { ApiLink } from './../../environment/links/api-link.environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isWritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { Ibrand } from '../../interfaces/brands/ibrand.interface';
import { Iresult } from '../../../shared/interfaces/result/iresult.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandServicesService {
  private readonly httpClient = inject(HttpClient);

  getBrands(): Observable<Iresult<Ibrand[]>> {
    return this.httpClient.get<Iresult<Ibrand[]>>(ApiLink.apiLink + 'brands');
  }
}
