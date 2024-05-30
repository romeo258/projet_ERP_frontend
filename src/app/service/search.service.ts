import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  private searchTerms = new Subject<string>();
  searchTerms$ = this.searchTerms.asObservable();

  search(term: string) {
    this.searchTerms.next(term);
  }
}
