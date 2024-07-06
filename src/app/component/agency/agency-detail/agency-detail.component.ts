import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable, BehaviorSubject, switchMap, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, AgencyState } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { AgencyService } from 'src/app/service/agency.service';

@Component({
  selector: 'app-agency-detail',
  templateUrl: './agency-detail.component.html',
  styleUrls: ['./agency-detail.component.css'],
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
export class AgencyDetailComponent implements OnInit {

  showScrollButton: boolean = false;
  showProductsSubject = new BehaviorSubject<boolean>(false);
  showProducts$ = this.showProductsSubject.asObservable();
  showOrdersSubject = new BehaviorSubject<boolean>(false);
  showOrders$ = this.showOrdersSubject.asObservable();

  totalLigneCommandes: number = 0;
  totalPrixVente: number = 0;
  ligneCommandes: any[] = [];
  filteredLigneCommandes: any[] = [];
  filterType: string = '';

  agencyState$: Observable<State<CustomHttpResponse<AgencyState>>>;
  deleteState$: Observable<State<CustomHttpResponse<AgencyState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<AgencyState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly AGENCY_ID: string = 'id';

  constructor(private activatedRoute: ActivatedRoute, private agencyService: AgencyService, private router: Router) { }

  ngOnInit(): void {
    this.agencyState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.agencyService.agency$(+params.get(this.AGENCY_ID))
          .pipe(
            map(response => {
              console.log(response);
              this.dataSubject.next(response);
              const totals = this.calculateTotalLigneCommandes(response.data.agency.products);
              this.totalLigneCommandes = totals.totalLigneCommandes;
              this.totalPrixVente = totals.totalPrixVente;
              this.ligneCommandes = this.extractLigneCommandes(response.data.agency.products);
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

  updateAgency(agencyForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.agencyState$ = this.agencyService.update$(agencyForm.value)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response, 
            data: { ...response.data, 
              agency: { ...response.data.agency, 
                products: this.dataSubject.value.data.agency.products }}});

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

  deleteAgency(id: number): void {
    this.isLoadingSubject.next(true);
    this.agencyState$ = this.agencyService.deleteAgencies$(id)
      .pipe(
        map(response => {
          console.log(response);
          // Mettre à jour l'état de chargement et réinitialiser le formulaire si nécessaire
          this.isLoadingSubject.next(false);
          // Retourner à l'état chargé avec les données mises à jour (ou non)
          this.router.navigate(['/agencies']);
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

// count command lignes and and total sales
private calculateTotalLigneCommandes(products: any[]): { totalLigneCommandes: number, totalPrixVente: number } {
  let totalLigneCommandes = 0;
  let totalPrixVente = 0;
  products.forEach(product => {
    product.ligneCommandes.forEach(ligneCommande => {
      totalLigneCommandes++;
      totalPrixVente += ligneCommande.prixVenteTotal;
    });
  });
  return { totalLigneCommandes, totalPrixVente };
}

// Extract commandLine of all products
private extractLigneCommandes(products: any[]): any[] {
  let allLigneCommandes = [];
  products.forEach(product => {
    allLigneCommandes = [...allLigneCommandes, ...product.ligneCommandes];
  });
  return allLigneCommandes;
}

toggleProducts() {
  this.showProductsSubject.next(!this.showProductsSubject.getValue());
}
toggleOrders() {
  this.showOrdersSubject.next(!this.showOrdersSubject.getValue());
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
