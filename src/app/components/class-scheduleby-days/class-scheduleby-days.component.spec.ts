import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSchedulebyDaysComponent } from './class-scheduleby-days.component';

describe('ClassSchedulebyDaysComponent', () => {
  let component: ClassSchedulebyDaysComponent;
  let fixture: ComponentFixture<ClassSchedulebyDaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassSchedulebyDaysComponent]
    });
    fixture = TestBed.createComponent(ClassSchedulebyDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
