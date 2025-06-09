import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserClassesModalComponent } from './user-classes-modal.component';

describe('UserClassesModalComponent', () => {
  let component: UserClassesModalComponent;
  let fixture: ComponentFixture<UserClassesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserClassesModalComponent]
    });
    fixture = TestBed.createComponent(UserClassesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
