import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Category } from 'src/app/interface/category';
import { CategoryService } from 'src/app/service/category.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-newcategory',
  templateUrl: './newcategory.component.html',
  styleUrls: ['./newcategory.component.css'],
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
export class NewcategoryComponent implements OnInit {

  showScrollButton: boolean = false;

  newCategoryState$: Observable<State<CustomHttpResponse<Page<Category> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Category> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.newCategoryState$ = this.categoryService.categories$()
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

  createCategory(newCategoryForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.newCategoryState$ = this.categoryService.newCategories$(newCategoryForm.value)
      .pipe(
        map(response => {
          // console.log(response);
          newCategoryForm.reset({ status: 'ACTIVE' });
          this.isLoadingSubject.next(false);
          this.router.navigate(['/categories']);
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
