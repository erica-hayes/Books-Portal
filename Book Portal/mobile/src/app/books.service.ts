import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { Book } from './book';
import { DEFAULT_BOOK_LIBRARY } from './book-catalog';

const BOOK_STORAGE_KEY = 'books-portal-mobile-library';
const API_ROOT = 'http://localhost:3000/books';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly booksSubject = new BehaviorSubject<Book[]>(this.readBooksFromStorage());

  constructor(private http: HttpClient) {}

  getBooks(): Observable<{ books: Book[] }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' });
    const options = { headers };

    return this.http.get<{ books: Book[] }>(`${API_ROOT}/getBooks`, options).pipe(
      map((response) => {
        const books = response.books && response.books.length ? response.books : [...DEFAULT_BOOK_LIBRARY];
        this.cacheBooks(books);
        return { books };
      }),
      catchError(() => of({ books: this.booksSubject.value }))
    );
  }

  getCachedBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  addBook(form: Partial<Book>): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' });
    const options = { headers };
    const book = this.normalizeBook(form);

    return this.http.post<any>(`${API_ROOT}/addBook`, book, options).pipe(
      timeout(10000),
      tap(() => this.appendBook(book)),
      catchError(() => {
        this.appendBook(book);
        return of({ msg: `${book.title} saved locally while the API was unavailable.` });
      })
    );
  }

  changeBook(email: string, id: string | number): Observable<{ success: boolean; book?: Book }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' });
    const options = { headers };

    return this.http.patch<{ success: boolean; book?: Book }>(`${API_ROOT}/changeBook/${id}`, { email }, options).pipe(
      tap((result) => {
        if (result.success && result.book) {
          this.replaceBook(result.book);
        }
      }),
      catchError(() => {
        const updated = this.updateLocalBorrowState(id, email);
        return of(updated ? { success: true, book: updated } : { success: false });
      })
    );
  }

  private readBooksFromStorage(): Book[] {
    if (typeof localStorage === 'undefined') {
      return [...DEFAULT_BOOK_LIBRARY];
    }

    try {
      const stored = localStorage.getItem(BOOK_STORAGE_KEY);
      if (!stored) {
        return [...DEFAULT_BOOK_LIBRARY];
      }

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length ? parsed : [...DEFAULT_BOOK_LIBRARY];
    } catch {
      return [...DEFAULT_BOOK_LIBRARY];
    }
  }

  private cacheBooks(books: Book[]): void {
    this.booksSubject.next([...books]);

    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
    } catch {
      // ignore storage failures
    }
  }

  private appendBook(book: Book): void {
    const nextBooks = [...this.booksSubject.value, book];
    this.cacheBooks(nextBooks);
  }

  private replaceBook(book: Book): void {
    const nextBooks = this.booksSubject.value.map((existing) => existing.ID === book.ID ? book : existing);
    this.cacheBooks(nextBooks);
  }

  private updateLocalBorrowState(id: string | number, email: string): Book | null {
    const nextBooks = this.booksSubject.value.map((book) => {
      if (book.ID !== id) {
        return book;
      }

      if (book.status === 'available' && !book.borrowedBy) {
        return { ...book, status: 'not available', borrowedBy: email };
      }

      if (book.status === 'not available' && book.borrowedBy === email) {
        return { ...book, status: 'available', borrowedBy: null };
      }

      return book;
    });

    const updatedBook = nextBooks.find((book) => book.ID === id) || null;
    if (updatedBook) {
      this.cacheBooks(nextBooks);
    }

    return updatedBook;
  }

  private normalizeBook(form: Partial<Book>): Book {
    return {
      ID: this.createLocalId(),
      title: (form.title || '').trim(),
      author: (form.author || '').trim(),
      publish_date: (form.publish_date || '').trim(),
      image: (form.image || '').trim(),
      category: (form.category || '').trim(),
      contact: (form.contact || '').trim(),
      phone: (form.phone || '').trim(),
      email: (form.email || '').trim(),
      abstract: (form.abstract || '').trim(),
      status: 'available',
      borrowedBy: null
    };
  }

  private createLocalId(): string {
    return `local-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }
}
