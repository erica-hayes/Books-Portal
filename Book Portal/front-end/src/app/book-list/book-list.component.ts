import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // 1. Import ActivatedRoute
import { Book } from '../book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  // 2. Inject ActivatedRoute into your constructor
  constructor(
    private service: BookService,
    private route: ActivatedRoute 
  ) { }

  ngOnInit() {
    this.service.getBooks().subscribe((result: any) => {
      this.books = result.books || [];
      
      // 3. Wait for the items to render on screen, then check for a URL fragment
      setTimeout(() => {
        this.route.fragment.subscribe(frag => {
          if (frag) {
            const element = document.getElementById(frag);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      }, 100); // A tiny 100ms delay gives Angular time to print the HTML cards
    });
  }
}