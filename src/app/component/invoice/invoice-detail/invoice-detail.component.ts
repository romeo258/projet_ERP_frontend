import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, InvoiceState } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { InvoiceService } from 'src/app/service/invoice.service';
import { Customer } from 'src/app/interface/customer';
import { Invoice } from 'src/app/interface/invoice';
import { User } from 'src/app/interface/user';
import { NgForm } from '@angular/forms';
import { LigneCommandeService } from 'src/app/service/ligne-commande.service';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css'],
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
export class InvoiceDetailComponent implements OnInit {

  showScrollButton: boolean = false;

  invoiceState$: Observable<State<CustomHttpResponse<Customer & Invoice & User>>>;
  deleteState$: Observable<State<CustomHttpResponse<Customer & Invoice & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer & Invoice & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly INVOICE_ID: string = 'id';

  totalAmount: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private invoiceService: InvoiceService, private ligneService: LigneCommandeService, private router: Router) { }

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.invoiceService.invoice$(+params.get(this.INVOICE_ID))
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
      })
    );
  }

  updateInvoice(invoiceForm: NgForm): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    this.invoiceState$ = this.invoiceService.update$(invoiceForm.value)
      .pipe(
        map(response => {
          // console.log(response);
          this.isLoadingSubject.next(false);
          this.router.navigate(['/invoices']);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }

  deleteInvoice(id: number): void {
    this.isLoadingSubject.next(true);
    this.invoiceState$ = this.invoiceService.deleteInvoices$(id)
      .pipe(
        map(response => {
          // console.log(response);
          this.isLoadingSubject.next(false);
          this.router.navigate(['/invoices']);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }

  deleteLigne(id: number): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    this.invoiceState$ = this.ligneService.deleteLignesDetail$(id)
    .pipe(
      map(response => {
        // console.log(response);
        this.isLoadingSubject.next(false);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: this.dataSubject.value };
      }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: any) => {
        this.isLoadingSubject.next(false);
        // Gérer les erreurs spécifiques ici
        const errorMessage = error?.error?.message || 'Une erreur est survenue lors de la suppression de la ligne de commande.';
        this.dataSubject.next({ ...this.dataSubject.value, error: errorMessage }); // Mettre à jour avec le message d'erreur
        return of({ dataState: DataState.ERROR, error });
      })
    );
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
