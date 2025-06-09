import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayDueAmountDialogComponent } from './pay-due-amount-dialog.component';

describe('PayDueAmountDialogComponent', () => {
  let component: PayDueAmountDialogComponent;
  let fixture: ComponentFixture<PayDueAmountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayDueAmountDialogComponent]
    });
    fixture = TestBed.createComponent(PayDueAmountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
