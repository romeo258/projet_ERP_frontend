import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse } from 'src/app/interface/appstates';
import { Customer } from 'src/app/interface/customer';
import { Invoice } from 'src/app/interface/invoice';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import jsPDF, { jsPDF as pdf } from 'jspdf';
import html2canvas from 'html2canvas';

const INVOICE_ID = 'id';
@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.css'],
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

export class InvoicePrintComponent implements OnInit {
  invoiceState$: Observable<State<CustomHttpResponse<Customer & Invoice & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer & Invoice & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private activatedRoute: ActivatedRoute, private invoiceService: InvoiceService ){}

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.invoiceService.invoice$(+params.get(INVOICE_ID))
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

  exportAsPDF(): void {
    const filename = `${this.dataSubject.value.data['invoice'].invoiceNumber}.pdf`;
    const doc = new pdf();
    doc.html(document.getElementById('invoice'), { margin: 5, windowWidth: 1000, width: 200, 
      callback: (invoice) => invoice.save(filename) });
  }

  

}
