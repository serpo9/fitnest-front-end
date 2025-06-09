import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDataDialogComponent } from './salary-data-dialog.component';

describe('SalaryDataDialogComponent', () => {
  let component: SalaryDataDialogComponent;
  let fixture: ComponentFixture<SalaryDataDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryDataDialogComponent]
    });
    fixture = TestBed.createComponent(SalaryDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
