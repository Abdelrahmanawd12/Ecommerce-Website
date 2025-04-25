import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../Services/AIService/chatbot.service';

@Component({
  selector: 'app-chat-bot-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot-ai.component.html',
  styleUrl: './chat-bot-ai.component.css'
})
export class ChatBotAiComponent implements OnDestroy {
  isChatbotVisible = false;
  messages: { text: string, sender: 'user' | 'bot', isTyping?: boolean, isThinking?: boolean }[] = [];
  newMessage = '';
  private typingSpeed = 30; 
  private thinkingInterval: any;
  private typingInterval: any;

  constructor(private chatService: ChatbotService) {}

  ngOnDestroy() {
    this.clearIntervals();
  }

  clearIntervals() {
    if (this.thinkingInterval) clearInterval(this.thinkingInterval);
    if (this.typingInterval) clearInterval(this.typingInterval);
  }

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, sender: 'user' });

      const userText = this.newMessage;
      this.newMessage = '';

      const thinkingMessageIndex = this.messages.length;
      this.messages.push({ 
        text: '...', 
        sender: 'bot', 
        isThinking: true 
      });
      
      this.animateThinkingDots(thinkingMessageIndex);

      this.chatService.sendMessage(userText).subscribe(
        res => {
          console.log("response: " + res);
          const fullReply = res.text || res || 'Sorry, I could not understand.';
          
          this.clearIntervals();
          this.messages.splice(thinkingMessageIndex, 1);
          
          this.messages.push({ 
            text: '', 
            sender: 'bot', 
            isTyping: true 
          });
          this.typeMessage(fullReply, this.messages.length - 1);
        },
        err => {
          console.error('Error:', err);
          this.clearIntervals();
          this.messages.splice(thinkingMessageIndex, 1);
          this.messages.push({ 
            text: 'Sorry, something went wrong.', 
            sender: 'bot' 
          });
        }
      );
    }
  }

  private animateThinkingDots(messageIndex: number) {
    let dotCount = 0;
    this.thinkingInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      this.messages[messageIndex].text = '.'.repeat(dotCount);
      this.scrollToBottom();
    }, 500);
  }

  private typeMessage(message: string, messageIndex: number) {
    let i = 0;
    this.typingInterval = setInterval(() => {
      if (i < message.length) {
        this.messages[messageIndex].text = message.substring(0, i + 1);
        i++;
        this.scrollToBottom();
      } else {
        this.messages[messageIndex].isTyping = false;
        clearInterval(this.typingInterval);
      }
    }, this.typingSpeed);
  }

  private scrollToBottom() {
    setTimeout(() => {
      const messageContainer = document.querySelector('.chatbot-messages');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }, 0);
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.isChatbotVisible = false;
  }
}