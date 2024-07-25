import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { InvoiceService } from 'src/app/service/invoice.service';
import { Invoice } from 'src/app/interface/invoice';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, startWith, switchMap, finalize, throwError } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition('void <=> *', [
        animate(300)
      ]),
    ])
  ]
})
export class InvoicesComponent implements OnInit {

  showScrollButton: boolean = false;

  invoicesState$: Observable<State<CustomHttpResponse<Page<Invoice> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Invoice> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;

  constructor(private router: Router, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoicesState$ = this.invoiceService.invoices$()
      .pipe(
        map(response => {
          // console.log(response);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  deleteInvoice(id: number): void {
    this.isLoadingSubject.next(true);
    let currentPage = 0;
    this.currentPage$.subscribe(page => currentPage = page).unsubscribe(); // Get current page

    this.invoiceService.deleteInvoices$(id)
      .pipe(
        switchMap(() => {
          return this.invoiceService.invoices$(currentPage); // Reload invoices on the current page
        }),
        catchError((error: string) => {
          return throwError(error);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      )
      .subscribe(
        response => {
          this.invoicesState$ = of({ dataState: DataState.LOADED, appData: response });
        },
        error => {
          this.invoicesState$ = of({ dataState: DataState.ERROR, error });
        }
      );
  }
  
  searchInvoices(searchForm: NgForm): void {
    this.currentPageSubject.next(0);
    this.invoicesState$ = this.invoiceService.searchInvoices$(searchForm.value.invoiceNumber)
      .pipe(
        map(response => {
          // console.log(response);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  

  goToPage(pageNumber?: number): void {
    this.invoicesState$ = this.invoiceService.invoices$(pageNumber)
      .pipe(
        map(response => {
          // console.log(response);
          this.dataSubject.next(response);
          this.currentPageSubject.next(pageNumber);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.LOADED, error, appData: this.dataSubject.value })
        })
      )
  }

  goToNextOrPreviousPage(direction?: string): void {
    this.goToPage(direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollDistance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollDistance > 100;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
