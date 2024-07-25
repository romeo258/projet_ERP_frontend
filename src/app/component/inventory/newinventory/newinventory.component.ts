import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Stock } from 'src/app/interface/stock';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { StockService } from 'src/app/service/stock.service';
import { NgForm } from '@angular/forms';
import { Product } from 'src/app/interface/product';

@Component({
  selector: 'app-newinventory',
  templateUrl: './newinventory.component.html',
  styleUrls: ['./newinventory.component.css'],
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
export class NewinventoryComponent implements OnInit {

  showScrollButton: boolean = false;

  newStockState$: Observable<State<CustomHttpResponse<Page<Product> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Product> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  filterText: string = '';
  selectedProductId: number;

  constructor(private stockService: StockService, private router: Router) { }

  ngOnInit(): void {
    this.newStockState$ = this.stockService.newProducts$()
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

  filterProducts(): void {
    const filterValue = this.filterText.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

  newStock(newStockForm: NgForm): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    this.newStockState$ = this.stockService.createStock$(newStockForm.value.productId, newStockForm.value)
      .pipe(
        map(response => {
          // console.log(response);
          // newStockForm.reset({ action: 'STOCK_IN' });
          this.isLoadingSubject.next(false);
          // this.dataSubject.next(response);
          this.router.navigate(['/inventories']);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, error })
        })
      )
  }



  

}
