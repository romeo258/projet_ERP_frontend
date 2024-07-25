import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Fournisseur } from 'src/app/interface/fournisseur';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { FournisseurService } from 'src/app/service/fournisseur.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-newfournisseur',
  templateUrl: './newfournisseur.component.html',
  styleUrls: ['./newfournisseur.component.css'],
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
export class NewfournisseurComponent implements OnInit {

  showScrollButton: boolean = false;

  newFournisseurState$: Observable<State<CustomHttpResponse<Page<Fournisseur> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Fournisseur> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private fournisseurService: FournisseurService, private router: Router) { }


  ngOnInit(): void {
    this.newFournisseurState$ = this.fournisseurService.fournisseurs$()
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

  createFournisseur(newFournisseurForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.newFournisseurState$ = this.fournisseurService.newFournisseurs$(newFournisseurForm.value)
      .pipe(
        map(response => {
          // console.log(response);
          newFournisseurForm.reset({ status: 'ACTIVE' });
          this.isLoadingSubject.next(false);
          this.router.navigate(['/fournisseurs']);
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
