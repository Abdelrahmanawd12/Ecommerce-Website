import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {



  // private apiUrl = 'http://localhost:3000/api/v1/prediction/d9d7da7a-eb6e-4da2-ab58-d60c8eedd583'; //ChatOllama
  private apiUrl = 'http://localhost:3000/api/v1/prediction/35271bc1-0adf-4399-b856-97f64c12e3a9'; //Chat Open AI

  constructor(private http: HttpClient) {}

  sendMessage(prompt: string) {
    return this.http.post<any>(this.apiUrl, {
      question: prompt
    });
  }
}