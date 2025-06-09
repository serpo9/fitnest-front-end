import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedUserComponent } from './requested-user.component';

describe('RequestedUserComponent', () => {
  let component: RequestedUserComponent;
  let fixture: ComponentFixture<RequestedUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestedUserComponent]
    });
    fixture = TestBed.createComponent(RequestedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
