import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Book } from 'src/app/book';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/books.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  constructor(private router: Router, private service: BooksService) { }
  isSubmitting = false;
  submitError = '';

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    author: new FormControl('',[Validators.required]),
    publish_date: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    abstract: new FormControl('', [Validators.required])
  });

  get title() {
    return this.form.get('title');
  }

  get author() {
    return this.form.get('author');
  }

  get publish_date() {
    return this.form.get('publish_date');
  }
  get image() {
    return this.form.get('image');
  }
  get category() {
    return this.form.get('category');
  }
  get contact() {
    return this.form.get('contact');
  }
  get phone() {
    return this.form.get('phone');
  }
  get email() {
    return this.form.get('email');
  }
  get abstract() {
    return this.form.get('abstract');
  }

  hasError(controlName: string, validationName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(validationName);
  }
  
  add_book(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    const book = this.form.value as Book;
    this.isSubmitting = true;
    this.submitError = '';

    this.service.addBook(book).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate(['/tabs/tab2']);
        this.isSubmitting = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.submitError = 'Unable to submit the book right now. Please try again.';
        this.isSubmitting = false;
      }
    });
  }



  ngOnInit() {}

}