import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClassModalComponent } from './assign-class-modal.component';

describe('AssignClassModalComponent', () => {
  let component: AssignClassModalComponent;
  let fixture: ComponentFixture<AssignClassModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignClassModalComponent]
    });
    fixture = TestBed.createComponent(AssignClassModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
