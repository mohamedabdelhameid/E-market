import { IProductDetail } from './../../interfaces/product-details/product-detail.interface';
import { inject, Injectable } from '@angular/core';
import { ApiLink } from '../../environment/links/api-link.environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailServices {
  private readonly httpClient = inject(HttpClient);

  getProductDetails(id: string | null): Observable<{ data: IProductDetail }> {
    return this.httpClient.get<{ data: IProductDetail }>(ApiLink.apiLink + `products/${id}`);
  }
}
