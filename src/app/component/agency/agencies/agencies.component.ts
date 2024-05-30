import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Agency } from 'src/app/interface/agency';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { AgencyService } from 'src/app/service/agency.service';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.css'],
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
export class AgenciesComponent implements OnInit {

  showScrollButton: boolean = false;


  agenciesState$: Observable<State<CustomHttpResponse<Page<Agency> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Agency> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;

  constructor(private router: Router, private agencyService: AgencyService) { }

  ngOnInit(): void {
    this.agenciesState$ = this.agencyService.searchAgencies$()
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

  searchAgencies(searchForm: NgForm): void {
    this.currentPageSubject.next(0);
    this.agenciesState$ = this.agencyService.searchAgencies$(searchForm.value.name)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  selectCustomer(agency: Agency): void {
    this.router.navigate([`/agencies/${agency.id}`]);
  }

  goToPage(pageNumber?: number, name?: string): void {
    this.agenciesState$ = this.agencyService.searchAgencies$(name, pageNumber)
      .pipe(
        map(response => {
          console.log(response);
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

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.goToPage(direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1, name);
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
