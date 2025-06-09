import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistergymComponent } from './registergym.component';

describe('RegistergymComponent', () => {
  let component: RegistergymComponent;
  let fixture: ComponentFixture<RegistergymComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistergymComponent]
    });
    fixture = TestBed.createComponent(RegistergymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
