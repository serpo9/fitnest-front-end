import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerotpComponent } from './trainerotp.component';

describe('TrainerotpComponent', () => {
  let component: TrainerotpComponent;
  let fixture: ComponentFixture<TrainerotpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerotpComponent]
    });
    fixture = TestBed.createComponent(TrainerotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
