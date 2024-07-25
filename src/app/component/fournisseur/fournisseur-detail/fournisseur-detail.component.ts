import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CustomHttpResponse, FournisseurState } from 'src/app/interface/appstates';
import { Observable, BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { State } from 'src/app/interface/state';
import { FournisseurService } from 'src/app/service/fournisseur.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fournisseur-detail',
  templateUrl: './fournisseur-detail.component.html',
  styleUrls: ['./fournisseur-detail.component.css'],
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
export class FournisseurDetailComponent implements OnInit {

  showScrollButton: boolean = false;

  fournisseurState$: Observable<State<CustomHttpResponse<FournisseurState>>>;
  deleteState$: Observable<State<CustomHttpResponse<FournisseurState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<FournisseurState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly FOURNISSEUR_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private fournisseurService: FournisseurService, private router: Router) { }

  ngOnInit(): void {
    this.fournisseurState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.fournisseurService.fournisseur$(+params.get(this.FOURNISSEUR_ID))
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

  updateFournisseur(fournisseurForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.fournisseurState$ = this.fournisseurService.update$(fournisseurForm.value)
      .pipe(
        map(response => {
          // console.log(response);
          this.dataSubject.next({ ...response, 
            data: { ...response.data, 
              fournisseur: { ...response.data.fournisseur, 
                products: this.dataSubject.value.data.fournisseur.products }}});

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

  deleteFournisseur(id: number): void {
    this.isLoadingSubject.next(true);
    this.fournisseurState$ = this.fournisseurService.deleteFournisseurs$(id)
      .pipe(
        map(response => {
          // console.log(response);
          // Mettre à jour l'état de chargement et réinitialiser le formulaire si nécessaire
          this.isLoadingSubject.next(false);
          // Retourner à l'état chargé avec les données mises à jour (ou non)
          this.router.navigate(['/fournisseurs']);
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
