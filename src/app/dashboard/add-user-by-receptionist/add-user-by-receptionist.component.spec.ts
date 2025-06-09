import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserByReceptionistComponent } from './add-user-by-receptionist.component';

describe('AddUserByReceptionistComponent', () => {
  let component: AddUserByReceptionistComponent;
  let fixture: ComponentFixture<AddUserByReceptionistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserByReceptionistComponent]
    });
    fixture = TestBed.createComponent(AddUserByReceptionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
