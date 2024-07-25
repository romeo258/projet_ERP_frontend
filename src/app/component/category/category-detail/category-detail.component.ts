import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CategoryState, CustomHttpResponse } from 'src/app/interface/appstates';
import { CategoryService } from 'src/app/service/category.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { State } from 'src/app/interface/state';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
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
export class CategoryDetailComponent implements OnInit {

  showScrollButton: boolean = false;

  categoryState$: Observable<State<CustomHttpResponse<CategoryState>>>;
  deleteState$: Observable<State<CustomHttpResponse<CategoryState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CategoryState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly CATEGORY_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private categoryService: CategoryService, private router: Router) { }


  ngOnInit(): void {
    this.categoryState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.categoryService.category$(+params.get(this.CATEGORY_ID))
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
      })
    );
  }

  updateCategory(categoryForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.categoryState$ = this.categoryService.update$(categoryForm.value)
      .pipe(
        map(response => {
          // console.log(response);
          this.dataSubject.next({ ...response, 
            data: { ...response.data, 
              category: { ...response.data.category, 
                products: this.dataSubject.value.data.category.products }}});

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

  deleteCategory(id: number): void {
    this.isLoadingSubject.next(true);
    this.categoryState$ = this.categoryService.deleteCategories$(id)
      .pipe(
        map(response => {
          // console.log(response);
          // Mettre à jour l'état de chargement et réinitialiser le formulaire si nécessaire
          this.isLoadingSubject.next(false);
          // Retourner à l'état chargé avec les données mises à jour (ou non)
          this.router.navigate(['/categories']);
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
