import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAttendanceComponent } from './users-attendance.component';

describe('UsersAttendanceComponent', () => {
  let component: UsersAttendanceComponent;
  let fixture: ComponentFixture<UsersAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersAttendanceComponent]
    });
    fixture = TestBed.createComponent(UsersAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
