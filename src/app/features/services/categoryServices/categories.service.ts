import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiLink } from '../../../core/environment/links/api-link.environment';
import { Iresult } from '../../../shared/interfaces/result/iresult.interface';
import { Icategory } from '../../../core/interfaces/categoryInterface/icategory.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getCategories(): Observable<Iresult<Icategory[]>> {
    return this.httpClient.get<Iresult<Icategory[]>>(ApiLink.apiLink + `categories`);
  }
}
