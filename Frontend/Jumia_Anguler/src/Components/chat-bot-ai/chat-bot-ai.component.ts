import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot-ai',
  imports: [ FormsModule],
  templateUrl: './chat-bot-ai.component.html',
  styleUrl: './chat-bot-ai.component.css'
})
export class ChatBotAiComponent {

  isChatbotVisible = false;
  messages: {text: string, sender: 'user' | 'bot'}[] = [];
  newMessage = '';

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({text: this.newMessage, sender: 'user'});
      
      // Simulate bot response
      setTimeout(() => {
        this.messages.push({text: this.getBotResponse(this.newMessage), sender: 'bot'});
      }, 500);
      
      this.newMessage = '';
    }
  }

  private getBotResponse(userMessage: string): string {
    // Add your AI logic or API call here
    const responses = [
      "Hello! How can I help you today?",
      "That's a good question, I'll try to help.",
      "Sorry, I don't understand. Could you clarify?",
      "Thank you for using our service!",
      "Do you have any other questions?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.isChatbotVisible = false;
  }
}
