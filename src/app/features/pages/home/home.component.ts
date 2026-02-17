import { Component } from '@angular/core';
import { LandingComponent } from './landing/landing.component';
import { HomeBrandingComponent } from './home-branding/home-branding.component';
import { HomeProductsComponent } from './home-products/home-products.component';
import { ContactComponent } from './contact/contact.component';
import { CategoriesComponent } from './categories/categories.component';

@Component({
  selector: 'app-home',
  imports: [
    LandingComponent,
    HomeBrandingComponent,
    HomeProductsComponent,
    ContactComponent,
    CategoriesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
