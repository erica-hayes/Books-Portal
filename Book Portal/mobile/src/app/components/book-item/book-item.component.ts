import { Component, OnInit, Input } from '@angular/core';
import { BooksService } from 'src/app/books.service';
import { Book } from '../../book';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.scss'],
})
export class BookItemComponent implements OnInit {
  @Input() book!: Book;

  constructor(private service: BooksService) { }
  

  change_book(f: { value: string }, id: string | number) {
    const email = f.value.trim();
    if (!email) {
      console.warn('Please enter a valid email');
      return;
    }

    this.service.changeBook(email, id).subscribe((result: { success: boolean; book?: any }) => {
      if (result.success && result.book) {
        this.book.status = result.book.status;
        this.book.borrowedBy = result.book.borrowedBy;
      } else {
        console.warn('Please enter a valid email or borrow/return with the same email.');
      }
    }, err => {
      console.error('Book update failed', err);
    });
  }

  ngOnInit() {}

}
