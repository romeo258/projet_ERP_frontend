import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, map, catchError, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Agency } from 'src/app/interface/agency';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { AgencyService } from 'src/app/service/agency.service';

@Component({
  selector: 'app-newagency',
  templateUrl: './newagency.component.html',
  styleUrls: ['./newagency.component.css'],
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
export class NewagencyComponent implements OnInit {

  showScrollButton: boolean = false;

  newAgencyState$: Observable<State<CustomHttpResponse<Page<Agency> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Agency> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private agencyService: AgencyService, private router: Router) { }

  ngOnInit(): void {
    this.newAgencyState$ = this.agencyService.agencies$()
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

  createAgency(newAgencyForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.newAgencyState$ = this.agencyService.newAgencies$(newAgencyForm.value)
      .pipe(
        map(response => {
          console.log(response);
          newAgencyForm.reset({ status: 'ACTIVE' });
          this.isLoadingSubject.next(false);
          this.router.navigate(['/agencies']);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, error })
        })
      )
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
