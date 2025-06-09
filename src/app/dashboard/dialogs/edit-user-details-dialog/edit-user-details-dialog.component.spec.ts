import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDetailsDialogComponent } from './edit-user-details-dialog.component';

describe('EditUserDetailsDialogComponent', () => {
  let component: EditUserDetailsDialogComponent;
  let fixture: ComponentFixture<EditUserDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(EditUserDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
