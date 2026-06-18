import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Book } from './book';
import { DEFAULT_BOOK_LIBRARY } from './book-catalog';

const BOOK_STORAGE_KEY = 'books-portal-web-library';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly booksSubject = new BehaviorSubject<Book[]>(this.readBooksFromStorage());

  getBooks(): Observable<{ books: Book[] }> {
    return of({ books: this.booksSubject.value });
  }

  addBook(form: any): Observable<{ msg: string }> {
    const book = this.normalizeBook(form);
    this.appendBook(book);

    return of({ msg: `${book.title} has been added successfully` });
  }

  changeBook(email: string, id: any): Observable<{ success: boolean; book?: Book }> {
    const updated = this.updateLocalBorrowState(id, email);

    if (!updated) {
      return of({ success: false });
    }

    return of({ success: true, book: updated });
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
      // Ignore storage failures and keep the in-memory copy.
    }
  }

  private appendBook(book: Book): void {
    const nextBooks = [...this.booksSubject.value, book];
    this.cacheBooks(nextBooks);
  }

  private updateLocalBorrowState(id: any, email: string): Book | null {
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

  private normalizeBook(form: any): Book {
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
