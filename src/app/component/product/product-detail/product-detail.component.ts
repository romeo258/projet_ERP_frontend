import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, ProductState } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
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
export class ProductDetailComponent implements OnInit {

  showScrollButton: boolean = false;

  productState$: Observable<State<CustomHttpResponse<ProductState>>>;
  deleteState$: Observable<State<CustomHttpResponse<ProductState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<ProductState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly PRODUCT_ID: string = 'id';

  totalAmount: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.productService.product$(+params.get(this.PRODUCT_ID))
          .pipe(
            map(response => {
              console.log(response);
              this.calculateTotalAmount(response.data.product.ligneCommandes);
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

  calculateTotalAmount(ligneCommandes: any[]): void {
    this.totalAmount = ligneCommandes.reduce((sum, item) => sum + (item.prixVenteTotal || 0), 0);
  }

  updateProduct(productForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.productState$ = this.productService.update$(productForm.value)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ 
            ...response, 
            data: { 
              ...response.data, 
              product: { 
                ...response.data.product, 
                ligneCommandes: this.dataSubject.value.data.product.ligneCommandes,
                stocks: this.dataSubject.value.data.product.stocks 
              }
            }
          });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }

  deleteProduct(id: number): void {
    this.isLoadingSubject.next(true);
    this.productState$ = this.productService.deleteProducts$(id)
      .pipe(
        map(response => {
          console.log(response);
          this.isLoadingSubject.next(false);
          this.router.navigate(['/products']);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
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
