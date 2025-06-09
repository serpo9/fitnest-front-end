import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubscriptionDialogComponent } from './view-subscription-dialog.component';

describe('ViewSubscriptionDialogComponent', () => {
  let component: ViewSubscriptionDialogComponent;
  let fixture: ComponentFixture<ViewSubscriptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSubscriptionDialogComponent]
    });
    fixture = TestBed.createComponent(ViewSubscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
