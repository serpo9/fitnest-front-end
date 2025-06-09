import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinScheduleComponent } from './join-schedule.component';

describe('JoinScheduleComponent', () => {
  let component: JoinScheduleComponent;
  let fixture: ComponentFixture<JoinScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinScheduleComponent]
    });
    fixture = TestBed.createComponent(JoinScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
