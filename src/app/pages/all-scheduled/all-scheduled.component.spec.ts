import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllScheduledComponent } from './all-scheduled.component';

describe('AllScheduledComponent', () => {
  let component: AllScheduledComponent;
  let fixture: ComponentFixture<AllScheduledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllScheduledComponent]
    });
    fixture = TestBed.createComponent(AllScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
