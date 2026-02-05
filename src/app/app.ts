import { Component, inject, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';
import { AuthServices } from './core/services/authServices/auth.services';
import { ToastUtilService } from './core/services/toastrServices/toastr.services';
import { Igest } from './core/interfaces/gestInterfaces/igest.interfaces';
import { Ierror } from './core/interfaces/errorInterface/ierror.interfaces';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly platformId = Inject(PLATFORM_ID);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }

  protected readonly title = signal('Emarket');
}
