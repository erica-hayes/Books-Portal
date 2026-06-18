import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getBooks() {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    const options = {headers: headers};
    return this.http.get(`http://localhost:3000/books/getBooks`, options);
  }

  addBook(form: any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    const options = {headers: headers};
    return this.http.post(`http://localhost:3000/books/addBook`, form, options);
  }

  changeBook(email: any, id: any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/json'});
    const options = {headers: headers};
    return this.http.patch(`http://localhost:3000/books/changeBook/${id}`, { email }, options);
  }
}
