import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserProfileDialogComponent } from './view-user-profile-dialog.component';

describe('ViewUserProfileDialogComponent', () => {
  let component: ViewUserProfileDialogComponent;
  let fixture: ComponentFixture<ViewUserProfileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserProfileDialogComponent]
    });
    fixture = TestBed.createComponent(ViewUserProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
