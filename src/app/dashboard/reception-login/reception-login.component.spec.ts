import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionLoginComponent } from './reception-login.component';

describe('ReceptionLoginComponent', () => {
  let component: ReceptionLoginComponent;
  let fixture: ComponentFixture<ReceptionLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionLoginComponent]
    });
    fixture = TestBed.createComponent(ReceptionLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
