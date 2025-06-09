import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSalaryDialogComponent } from './assign-salary-dialog.component';

describe('AssignSalaryDialogComponent', () => {
  let component: AssignSalaryDialogComponent;
  let fixture: ComponentFixture<AssignSalaryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignSalaryDialogComponent]
    });
    fixture = TestBed.createComponent(AssignSalaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
