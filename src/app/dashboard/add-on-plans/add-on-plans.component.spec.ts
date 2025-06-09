import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnPlansComponent } from './add-on-plans.component';

describe('AddOnPlansComponent', () => {
  let component: AddOnPlansComponent;
  let fixture: ComponentFixture<AddOnPlansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOnPlansComponent]
    });
    fixture = TestBed.createComponent(AddOnPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
