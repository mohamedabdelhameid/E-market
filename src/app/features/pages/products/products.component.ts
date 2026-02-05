import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import {
  Brand,
  Category,
  Iproduct,
  Subcategory,
} from '../../../core/interfaces/products/iproduct.interface';
import { ProductServiceServices } from '../../../core/services/products/product-service.services';
import { Iresult } from '../../../shared/interfaces/result/iresult.interface';
import { ProductCategoriesServices } from '../../../core/services/category/product-categories.services';
import { BrandServicesService } from '../../../core/services/brands/brand-services.service';
import { Ibrand } from '../../../core/interfaces/brands/ibrand.interface';
import { CartServices } from '../../services/cartServices/cart.services';
import { ToastUtilService } from '../../../core/services/toastrServices/toastr.services';
import { RootCart } from '../../../core/interfaces/cartItems/cart.interfaces';
import { Ierror } from '../../../core/interfaces/errorInterface/ierror.interfaces';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-products',
  imports: [CardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private readonly productServicesService = inject(ProductServiceServices);
  private readonly categoryServiceService = inject(ProductCategoriesServices);
  private readonly brandServicesService = inject(BrandServicesService);
  private readonly cartServices = inject(CartServices);
  private readonly plate_ID = inject(PLATFORM_ID);
  products: WritableSignal<Iproduct[]> = signal([]);
  toastr = inject(ToastUtilService);
  categories: WritableSignal<Category[]> = signal([]);
  subCategories: WritableSignal<Subcategory[]> = signal([]);
  brands: WritableSignal<Brand[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  selectedBrand: WritableSignal<string> = signal('');
  selectedCategory: WritableSignal<string> = signal('');
  selected: WritableSignal<string | null> = signal(null);
  addProductLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProductsData();
    this.getCategories();
    this.getSubCategories();
    this.getBrands();
  }

  getProductsData(): void {
    this.isLoading.set(true);
    this.productServicesService.getProducts().subscribe({
      next: (res: Iresult<Iproduct[]>) => {
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  productsBySearch(search: string): void {
    this.isLoading.set(true);
    this.productServicesService.getProducts().subscribe({
      next: (res: Iresult<Iproduct[]>) => {
        if (search.trim() != '') {
          this.products.set(
            res.data.filter((product) =>
              product.title.toLowerCase().includes(search.toLowerCase()),
            ),
          );
        } else {
          this.products.set(res.data);
        }
        this.isLoading.set(false);
      },
    });
  }

  filterProductsByCategory(selectedCategory: string): void {
    this.isLoading.set(true);
    this.selectedCategory.set(selectedCategory);
    this.products.set(
      this.products().filter((product) => product.category.name === selectedCategory),
    );
    this.isLoading.set(false);
  }

  filterByBrand(selectedBrand: string): void {
    this.isLoading.set(true);
    this.selectedBrand.set(selectedBrand);
    this.products.set(this.products().filter((product) => product.brand.name === selectedBrand));
    this.isLoading.set(false);
  }

  getCategories(): void {
    this.isLoading.set(true);
    this.categoryServiceService.getCategories().subscribe({
      next: (res: Iresult<Category[]>) => {
        this.categories.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  getSubCategories(): void {
    this.isLoading.set(true);
    this.categoryServiceService.getSubCategories('').subscribe({
      next: (res: Iresult<Subcategory[]>) => {
        this.subCategories.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  getBrands(): void {
    this.brandServicesService.getBrands().subscribe({
      next: (res: Iresult<Ibrand[]>) => {
        this.brands.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.isLoading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.selectedBrand.set('');
    this.selectedCategory.set('');
    this.getProductsData();
  }

  addProductToCart(productId: string): void {
    this.selected.set(productId);

    this.addProductLoading.set(true);
    this.cartServices.addProductToCart(productId).subscribe({
      next: (res: RootCart) => {
        this.toastr.success(`${res.message}`, `Success`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.addProductLoading.set(false);
      },
      error: (err: Ierror) => {
        if (err.status === 401) {
          this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
        }
        this.addProductLoading.set(false);
      },
    });
  }
}
