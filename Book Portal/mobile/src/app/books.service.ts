import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private http: HttpClient) { }

  getBooks(): Observable<{ books: Book[] }> {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    const options = {headers: headers};
    return this.http.get<{ books: Book[] }>(`http://localhost:3000/books/getBooks`, options);
  }
  
  addBook(form: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    const options = {headers: headers};
    return this.http.post<any>(`http://localhost:3000/books/addBook`, form, options);
  }

  changeBook(email: string, id: string | number): Observable<{ success: boolean; book?: Book }> {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    const options = {headers: headers};
    return this.http.patch<{ success: boolean; book?: Book }>(`http://localhost:3000/books/changeBook/${id}`, { email }, options);
  }
}
