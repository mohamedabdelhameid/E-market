import { Component, inject, signal, WritableSignal } from '@angular/core';
import { BrandServicesService } from '../../../../core/services/brands/brand-services.service';
import { Iresult } from '../../../../shared/interfaces/result/iresult.interface';
import { Ibrand } from '../../../../core/interfaces/brands/ibrand.interface';
import { ToastUtilService } from '../../../../core/services/toastrServices/toastr.services';
import { Ierror } from '../../../../core/interfaces/errorInterface/ierror.interfaces';

@Component({
  selector: 'app-home-branding',
  imports: [],
  templateUrl: './home-branding.component.html',
  styleUrl: './home-branding.component.css',
})
export class HomeBrandingComponent {
  private readonly brandServicesService = inject(BrandServicesService);
  brands: WritableSignal<Ibrand[]> = signal([]);
  toastr = inject(ToastUtilService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getBrandsData();
  }

  getBrandsData(): void {
    this.brandServicesService.getBrands().subscribe({
      next: (res: Iresult<Ibrand[]>) => {
        this.brands.set(
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
}
