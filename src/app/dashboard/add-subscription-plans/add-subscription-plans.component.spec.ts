import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubscriptionPlansComponent } from './add-subscription-plans.component';

describe('AddSubscriptionPlansComponent', () => {
  let component: AddSubscriptionPlansComponent;
  let fixture: ComponentFixture<AddSubscriptionPlansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubscriptionPlansComponent]
    });
    fixture = TestBed.createComponent(AddSubscriptionPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
