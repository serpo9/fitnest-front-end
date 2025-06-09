import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedAmountsComponent } from './received-amounts.component';

describe('ReceivedAmountsComponent', () => {
  let component: ReceivedAmountsComponent;
  let fixture: ComponentFixture<ReceivedAmountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivedAmountsComponent]
    });
    fixture = TestBed.createComponent(ReceivedAmountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
