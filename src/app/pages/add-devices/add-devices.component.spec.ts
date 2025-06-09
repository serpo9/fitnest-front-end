import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDevicesComponent } from './add-devices.component';

describe('AddDevicesComponent', () => {
  let component: AddDevicesComponent;
  let fixture: ComponentFixture<AddDevicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDevicesComponent]
    });
    fixture = TestBed.createComponent(AddDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
