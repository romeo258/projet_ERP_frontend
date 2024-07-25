import { Component, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Product } from 'src/app/interface/product';
import { Observable, BehaviorSubject, catchError, map, of, startWith, finalize, tap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { ProductService } from 'src/app/service/product.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Agency } from 'src/app/interface/agency';
import { Category } from 'src/app/interface/category';
import { Fournisseur } from 'src/app/interface/fournisseur';
import { CombinedData } from 'src/app/interface/combined-data';

@Component({
  selector: 'app-newproduct',
  templateUrl: './newproduct.component.html',
  styleUrls: ['./newproduct.component.css'],
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
export class NewproductComponent {

  showScrollButton: boolean = false;

  newProductState$: Observable<State<CustomHttpResponse<CombinedData>>>;
  private dataSubject = new BehaviorSubject<State<CustomHttpResponse<CombinedData>>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.newProductState$ = this.productService.newCatAgFou$()
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

  newProduct(newProductForm: NgForm): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    this.newProductState$ = this.productService.createProduct$(
      newProductForm.value.agencyId, 
      newProductForm.value.fournisseurId, 
      newProductForm.value.categoryId, 
      newProductForm.value
    ).pipe(
      map(response => {
        // console.log(response);
        newProductForm.reset();
        this.isLoadingSubject.next(false);
        this.dataSubject.next({ dataState: DataState.LOADED, appData: response });
        return { dataState: DataState.LOADED, appData: response };
      }),
      startWith({ dataState: DataState.LOADING, appData: this.dataSubject.value?.appData }),
      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        const errorResponse: CustomHttpResponse<CombinedData> = {
          timestamp: new Date(),
          statusCode: 500,
          status: 'Error',
          message: 'Failed to create product',
          reason: error
        };
        return of({ dataState: DataState.ERROR, appData: errorResponse });
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

