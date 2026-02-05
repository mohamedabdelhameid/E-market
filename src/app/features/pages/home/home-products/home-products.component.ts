import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProductServiceServices } from '../../../../core/services/products/product-service.services';
import { Iresult } from '../../../../shared/interfaces/result/iresult.interface';
import { Iproduct } from '../../../../core/interfaces/products/iproduct.interface';
import { RouterLink } from '@angular/router';
import { ToastUtilService } from '../../../../core/services/toastrServices/toastr.services';
import { CartServices } from '../../../services/cartServices/cart.services';
import { RootCart } from '../../../../core/interfaces/cartItems/cart.interfaces';
import { Ierror } from '../../../../core/interfaces/errorInterface/ierror.interfaces';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-home-products',
  imports: [RouterLink, CardComponent],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent {
  private readonly productServicesService = inject(ProductServiceServices);
  private readonly cartServices = inject(CartServices);
  products: WritableSignal<Iproduct[]> = signal([]);
  toastr = inject(ToastUtilService);
  selected: WritableSignal<string | null> = signal(null);
  addProductLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProductsData();
  }

  getProductsData(): void {
    this.productServicesService.getProducts().subscribe({
      next: (res: Iresult<Iproduct[]>) => {
        this.products.set(
          res.data
            .slice()
            .sort(() => Math.random() - 0.5)
            .slice(0, 12),
        );
      },
      error: (err: Ierror) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
      },
    });
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
