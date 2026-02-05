import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLink } from '../../environment/links/api-link.environment';
import { Iresult } from '../../../shared/interfaces/result/iresult.interface';
import { Iproduct } from '../../interfaces/products/iproduct.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceServices {
  private readonly httpClient = inject(HttpClient);

  getProducts(): Observable<Iresult<Iproduct[]>> {
    return this.httpClient.get<Iresult<Iproduct[]>>(ApiLink.apiLink + 'products');
  }
}
