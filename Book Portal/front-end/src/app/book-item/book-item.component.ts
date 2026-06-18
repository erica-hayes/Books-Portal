import { Component, OnInit, Input } from '@angular/core';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.css']
})
export class BookItemComponent implements OnInit {
  @Input() book;

  constructor(private service: BookService) { }

  change_book(f, id) {
    const email = f && f.value ? f.value.trim() : '';
    if (!email) {
      console.warn('Please enter a valid email');
      return;
    }

    this.service.changeBook(email, id).subscribe((result: { success: boolean, book?: any }) => {
      if (result.success) {
        if (result.book) {
          this.book.status = result.book.status;
          this.book.borrowedBy = result.book.borrowedBy;
        }
      } else {
        console.warn('Please enter a valid borrower email');
      }
    }, error => {
      console.error('Error updating book status', error);
    });
  }

  ngOnInit() {
  }

}
