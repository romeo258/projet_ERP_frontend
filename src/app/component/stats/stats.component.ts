import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Stats } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { StatsService } from 'src/app/service/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  statsState$: Observable<State<CustomHttpResponse<Stats>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Stats>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  selectedDate: string;
  selectedMonthYear: string;
  selectedYear: string;
  isDate = false;
  isMonthYear = false;
  isYear = false;
  isWeek = false;

  statsForm: FormGroup;

  showScrollButton: boolean = false;

  constructor(private fb: FormBuilder, private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsForm = this.fb.group({
      date: [''],
      isDate: [false],
      monthYear: [''],
      isMonthYear: [false],
      year: [''],
      isYear: [false],
      week: [false]
    });

    this.statsForm.valueChanges.subscribe(() => {
      this.fetchStats();
    });

    this.fetchStatsWithoutParams();
  }

  onCheckboxChange(checkedField: string): void {
    const controls = ['isDate', 'isMonthYear', 'isYear', 'week'];
    controls.forEach(control => {
      if (control !== checkedField) {
        this.statsForm.get(control).setValue(false, { emitEvent: false });
      }
    });
    this.fetchStats();
  }

  onDateChange(): void {
    this.statsForm.get('isDate').setValue(true, { emitEvent: false });
    this.onCheckboxChange('isDate');
  }

  onMonthYearChange(): void {
    this.statsForm.get('isMonthYear').setValue(true, { emitEvent: false });
    this.onCheckboxChange('isMonthYear');
  }

  onYearChange(): void {
    this.statsForm.get('isYear').setValue(true, { emitEvent: false });
    this.onCheckboxChange('isYear');
  }

  fetchStats(): void {
    const params: any = {};
    if (this.statsForm.get('isDate').value) params.date = this.statsForm.get('date').value;
    if (this.statsForm.get('isMonthYear').value) params.monthYear = this.statsForm.get('monthYear').value;
    if (this.statsForm.get('isYear').value) params.year = this.statsForm.get('year').value;
    if (this.statsForm.get('week').value) params.week = true;

    this.statsState$ = this.statsService.getStats$(params)
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, appData: this.dataSubject.value, error })
        })
      );
  }

  fetchStatsWithoutParams(): void {
    this.statsState$ = this.statsService.stats$()
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, appData: this.dataSubject.value, error })
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
