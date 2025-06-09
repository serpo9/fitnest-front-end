import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterClassComponent } from './register-class.component';

describe('RegisterClassComponent', () => {
  let component: RegisterClassComponent;
  let fixture: ComponentFixture<RegisterClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterClassComponent]
    });
    fixture = TestBed.createComponent(RegisterClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
