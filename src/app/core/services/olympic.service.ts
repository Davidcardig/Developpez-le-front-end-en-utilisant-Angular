import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map, take } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { DetailsData } from '../models/ChartsData';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error('Error loading Olympic data', error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  // renvoie un observable pour s'abonner aux données des Olympics
  public getOlympics() : Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

// renvoie le nombre total de médailles pour un pays donné
  public getMedalCount(country: string): number {
    let count = 0;
    this.olympics$.pipe(take(1)).subscribe((data: Olympic[]) => {
      const entry = data.find((olympic: Olympic) => olympic.country === country);
      if (entry) {
        count = entry.participations.reduce((total: number, p: Participation) => total + (p.medalsCount), 0);
      }
    });
    return count;
  }


  // Récupère les détails d'un pays spécifique
  public getCountryDetails(country: string): Observable<DetailsData | null> {
    return this.olympics$.pipe(
      map((list: Olympic[]) => {
        const entry = list.find((olympic) => olympic.country === country);
        if (!entry) return null;
        const parts = entry.participations;
        // Création directe de la série de médailles triée par année
        const medalsSeries = [{
          name: country,
          series: parts
            .map(p => ({name: p.year, value: p.medalsCount}))
        }];
        return {
          medalsSeries,
          totalParticipations: parts.length,
          totalMedals: parts.reduce((total, participation) => total + (participation.medalsCount), 0),
          totalAthletes: parts.reduce((total, participation) => total + (participation.athleteCount), 0)
        };
      })
    );
  }
}

