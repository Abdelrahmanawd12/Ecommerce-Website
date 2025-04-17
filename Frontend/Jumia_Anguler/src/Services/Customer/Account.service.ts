import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountDetails,AddressBook } from '../../Models/Account';
import { Observable } from 'rxjs';
import { environment } from '../../../src/Environment/Environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAccountDetails(customerId: string): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${this.apiUrl}/account/details/${customerId}`);
  }
  getAddressBook(customerId: string): Observable<AddressBook> {
    return this.http.get<AddressBook>(`${this.apiUrl}/account/address-book/${customerId}`);
  }
   // Method to update the address book
   updateAddressBook(customerId: string, addressBook: AddressBook): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/account/address-book/${customerId}`, addressBook);
  }
}
