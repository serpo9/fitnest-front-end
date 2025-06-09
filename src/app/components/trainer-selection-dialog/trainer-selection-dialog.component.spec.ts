import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerSelectionDialogComponent } from './trainer-selection-dialog.component';

describe('TrainerSelectionDialogComponent', () => {
  let component: TrainerSelectionDialogComponent;
  let fixture: ComponentFixture<TrainerSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainerSelectionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
