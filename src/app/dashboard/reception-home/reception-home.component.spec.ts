import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionHomeComponent } from './reception-home.component';

describe('ReceptionHomeComponent', () => {
  let component: ReceptionHomeComponent;
  let fixture: ComponentFixture<ReceptionHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionHomeComponent]
    });
    fixture = TestBed.createComponent(ReceptionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
