import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null | undefined>(undefined);
 
  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  } 

  getOlympics() {
    return this.olympics$.asObservable();
  }

  
  public getCountryName(event: any): string {
    if (typeof event?.value?.name === 'string') return event.value.name;
    return '';
  }

  public getMedalCount(country: string): number {
    const olympics = this.olympics$.getValue() || [];
    const found: Olympic | undefined = olympics.find(o => o.country === country);
    return found?.participations.reduce((total, p) => total + (p.medalsCount || 0), 0) || 0;
  }
}
