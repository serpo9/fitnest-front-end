import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerClassesModalComponent } from './trainer-classes-modal.component';

describe('TrainerClassesModalComponent', () => {
  let component: TrainerClassesModalComponent;
  let fixture: ComponentFixture<TrainerClassesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerClassesModalComponent]
    });
    fixture = TestBed.createComponent(TrainerClassesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
