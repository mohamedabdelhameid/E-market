import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBrandingComponent } from './home-branding.component';

describe('HomeBrandingComponent', () => {
  let component: HomeBrandingComponent;
  let fixture: ComponentFixture<HomeBrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBrandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBrandingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
