import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUserProgressDialogComponent } from './post-user-progress-dialog.component';

describe('PostUserProgressDialogComponent', () => {
  let component: PostUserProgressDialogComponent;
  let fixture: ComponentFixture<PostUserProgressDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostUserProgressDialogComponent]
    });
    fixture = TestBed.createComponent(PostUserProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
