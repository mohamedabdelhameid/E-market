import { inject, Injectable } from '@angular/core';
import { ApiLink } from '../../environment/links/api-link.environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Subcategory } from '../../interfaces/products/iproduct.interface';
import { Iresult } from '../../../shared/interfaces/result/iresult.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoriesServices {
  private readonly httpClient = inject(HttpClient);

  getCategories(): Observable<Iresult<Category[]>> {
    return this.httpClient.get<Iresult<Category[]>>(ApiLink.apiLink + 'categories');
  }

  getSubCategories(id?: string): Observable<Iresult<Subcategory[]>> {
    return this.httpClient.get<Iresult<Subcategory[]>>(
      ApiLink.apiLink + 'subcategories' + `/${id}`,
    );
  }
}
