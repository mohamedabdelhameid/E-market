import { Component, inject, signal } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CategoriesService } from '../../../services/categoryServices/categories.service';
import { Icategory } from '../../../../core/interfaces/categoryInterface/icategory.interface';
import { ToastUtilService } from '../../../../core/services/toastrServices/toastr.services';

@Component({
  selector: 'app-categories',
  imports: [CarouselModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly categoriesService = inject(CategoriesService);
  toastr = inject(ToastUtilService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllCategories();
  }

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
  };

  slidesStore = signal<Icategory[]>([]);

  getAllCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.slidesStore.set(res.data);
      },
      error: (err) => {
        this.toastr.error(`${err.error.message}`, `${err.error.statusMsg}`, {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
      },
    });
  }
}
