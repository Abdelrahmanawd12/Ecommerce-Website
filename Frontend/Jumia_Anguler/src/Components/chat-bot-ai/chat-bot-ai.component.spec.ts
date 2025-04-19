import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotAiComponent } from './chat-bot-ai.component';

describe('ChatBotAiComponent', () => {
  let component: ChatBotAiComponent;
  let fixture: ComponentFixture<ChatBotAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBotAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBotAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
