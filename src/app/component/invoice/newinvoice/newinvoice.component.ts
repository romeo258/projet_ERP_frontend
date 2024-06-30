import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, BehaviorSubject, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse } from 'src/app/interface/appstates';
import { Customer } from 'src/app/interface/customer';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { InvoiceService } from 'src/app/service/invoice.service';
import { NgForm } from '@angular/forms';
import { LigneCommandeService } from 'src/app/service/ligne-commande.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newinvoice',
  templateUrl: './newinvoice.component.html',
  styleUrls: ['./newinvoice.component.css'],
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
export class NewinvoiceComponent implements OnInit {

  showScrollButton: boolean = false;

  newInvoiceState$: Observable<State<CustomHttpResponse<Customer[] & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer[] & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;


  constructor(private invoiceService: InvoiceService, private ligneCommandeService : LigneCommandeService, private router: Router) { }

  ngOnInit(): void {
    this.newInvoiceState$ = this.invoiceService.newInvoice$()
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  selectedCustomerId: string | null = null;
  selectedStatus: string = 'PENDING';
  @ViewChild('invoiceIdInput') invoiceIdInput: ElementRef;

  newInvoice(newInvoiceForm: NgForm): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    this.newInvoiceState$ = this.invoiceService.createInvoice$(newInvoiceForm.value.customerId, newInvoiceForm.value)
      .pipe(
        map(response => {
          console.log(response);
          newInvoiceForm.reset({ status: 'UNPAID'});
          this.selectedCustomerId = null;
          this.isLoadingSubject.next(false);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, error })
        })
      )
  }

  newLigne(newLigneForm: NgForm): void {
    const invoiceId = this.invoiceIdInput.nativeElement.value;
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    this.newInvoiceState$ = this.ligneCommandeService.createLigne$(invoiceId, newLigneForm.value.productId, newLigneForm.value)
      .pipe(
        map(response => {
          console.log(response);
          newLigneForm.reset({ productId: 'null'});
          newLigneForm.reset({ quantityLC: ''});
          this.isLoadingSubject.next(false);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: any) => {
          this.isLoadingSubject.next(false);
          // Gérer les erreurs spécifiques ici
          const errorMessage = error?.error?.message || 'Une erreur est survenue lors de la création de la ligne de commande.';
          this.dataSubject.next({ ...this.dataSubject.value, error: errorMessage }); // Mettre à jour avec le message d'erreur
          return of({ dataState: DataState.ERROR, error });
        })
      )
  }

  deleteInvoice(id: number): void {
    this.isLoadingSubject.next(true);
    this.newInvoiceState$ = this.invoiceService.deleteInvoices$(id)
      .pipe(
        map(response => {
          console.log(response);
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
    this.newInvoiceState$ = this.ligneCommandeService.deleteLignes$(id)
    .pipe(
      map(response => {
        console.log(response);
        this.isLoadingSubject.next(false);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: this.dataSubject.value };
      }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: any) => {
        this.isLoadingSubject.next(false);
        // Gérer les erreurs spécifiques ici
        const errorMessage = error?.error?.message || 'Une erreur est survenue lors de la création de la ligne de commande.';
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
