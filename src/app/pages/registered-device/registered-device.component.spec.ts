import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredDeviceComponent } from './registered-device.component';

describe('RegisteredDeviceComponent', () => {
  let component: RegisteredDeviceComponent;
  let fixture: ComponentFixture<RegisteredDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisteredDeviceComponent]
    });
    fixture = TestBed.createComponent(RegisteredDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
