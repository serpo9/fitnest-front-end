import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerAttendanceComponent } from './trainer-attendance.component';

describe('TrainerAttendanceComponent', () => {
  let component: TrainerAttendanceComponent;
  let fixture: ComponentFixture<TrainerAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerAttendanceComponent]
    });
    fixture = TestBed.createComponent(TrainerAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
