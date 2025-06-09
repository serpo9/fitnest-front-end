import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackUserDialogComponent } from './track-user-dialog.component';

describe('TrackUserDialogComponent', () => {
  let component: TrackUserDialogComponent;
  let fixture: ComponentFixture<TrackUserDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackUserDialogComponent]
    });
    fixture = TestBed.createComponent(TrackUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
