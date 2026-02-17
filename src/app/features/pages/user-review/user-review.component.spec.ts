import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReviewComponent } from './user-review.component';

describe('UserReviewComponent', () => {
  let component: UserReviewComponent;
  let fixture: ComponentFixture<UserReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
