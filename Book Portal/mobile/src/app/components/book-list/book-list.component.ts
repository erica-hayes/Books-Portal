import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/book';
import { BooksService } from 'src/app/books.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  private booksSubscription: Subscription | null = null;

  constructor(private service: BooksService) {
  }

  ngOnInit() {
    this.booksSubscription = this.service.getCachedBooks().subscribe((books) => {
      this.books = books || [];
    });

    this.service.getBooks().subscribe({
      error: () => {
        this.books = this.books || [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.booksSubscription) {
      this.booksSubscription.unsubscribe();
    }
  }

}
