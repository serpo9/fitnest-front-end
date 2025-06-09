import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDialogueComponent } from './message-dialogue.component';

describe('MessageDialogueComponent', () => {
  let component: MessageDialogueComponent;
  let fixture: ComponentFixture<MessageDialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDialogueComponent]
    });
    fixture = TestBed.createComponent(MessageDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
