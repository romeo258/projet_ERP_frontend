import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomerState, CustomHttpResponse } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
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
export class CustomerDetailComponent implements OnInit {

  showScrollButton: boolean = false;

  customerState$: Observable<State<CustomHttpResponse<CustomerState>>>;
  deleteState$: Observable<State<CustomHttpResponse<CustomerState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CustomerState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly CUSTOMER_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.customerState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.customerService.customer$(+params.get(this.CUSTOMER_ID))
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
      })
    );
  }

  updateCustomer(customerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.customerState$ = this.customerService.update$(customerForm.value)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response, 
            data: { ...response.data, 
              customer: { ...response.data.customer, 
                invoices: this.dataSubject.value.data.customer.invoices }}});

          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  deleteCustomer(id: number): void {
    this.isLoadingSubject.next(true);
    this.customerState$ = this.customerService.deleteCustomers$(id)
      .pipe(
        map(response => {
          console.log(response);
          // Mettre à jour l'état de chargement et réinitialiser le formulaire si nécessaire
          this.isLoadingSubject.next(false);
          // Retourner à l'état chargé avec les données mises à jour (ou non)
          this.router.navigate(['/customers']);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          // Gérer les erreurs
          this.isLoadingSubject.next(false);
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
