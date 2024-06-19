import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CustomHttpResponse, StockState } from 'src/app/interface/appstates';
import { Observable, BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { State } from 'src/app/interface/state';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css'],
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
export class InventoryDetailComponent implements OnInit {

  showScrollButton: boolean = false;

  stockState$: Observable<State<CustomHttpResponse<StockState>>>;
  deleteState$: Observable<State<CustomHttpResponse<StockState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<StockState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly STOCK_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private stockService: StockService, private router: Router) { }


  ngOnInit(): void {
    this.stockState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.stockService.stock$(+params.get(this.STOCK_ID))
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


}
