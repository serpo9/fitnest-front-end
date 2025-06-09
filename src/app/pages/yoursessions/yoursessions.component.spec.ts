import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoursessionsComponent } from './yoursessions.component';

describe('YoursessionsComponent', () => {
  let component: YoursessionsComponent;
  let fixture: ComponentFixture<YoursessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YoursessionsComponent]
    });
    fixture = TestBed.createComponent(YoursessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
