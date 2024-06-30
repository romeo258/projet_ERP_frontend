import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CustomHttpResponse, LineState } from 'src/app/interface/appstates';
import { LigneCommandeService } from 'src/app/service/ligne-commande.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable, BehaviorSubject, switchMap, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { State } from 'src/app/interface/state';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
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
export class OrderDetailComponent implements OnInit {

  showScrollButton: boolean = false;

  orderState$: Observable<State<CustomHttpResponse<LineState>>>;
  deleteState$: Observable<State<CustomHttpResponse<LineState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<LineState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly LINE_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private ligneService: LigneCommandeService, private router: Router) { }


  ngOnInit(): void {
    this.orderState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.ligneService.line$(+params.get(this.LINE_ID))
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
