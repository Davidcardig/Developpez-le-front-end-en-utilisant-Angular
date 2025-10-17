import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { HoverInfo, EventData } from 'src/app/core/models/ChartsData';
import { Participation } from 'src/app/core/models/Participation';
import { SummaryCardComponent } from 'src/app/shared/components/summary-card/summary-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  chartData: any[] = [];
  numberJO?: number;
  numberCountries?: number;
  summaryCards: HoverInfo[] = [];
  hoverInfo?: HoverInfo;
  chartView: [number, number] = [700, 500];
  private destroy$ = new Subject<void>();


  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.chartSize();
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(olympics => {
        this.getOlympicsData(olympics);
        this.numberJO = new Set(olympics?.flatMap(item => item.participations.map((p: any) => p.year))).size;
        this.numberCountries = olympics?.length;
        this.summaryCards = [
          { name: 'Number of JO', value: this.numberJO },
          { name: 'Number of countries', value: this.numberCountries },
        ];
      });
  }


  // Mise à jour de la taille du graphique accueil
  @HostListener('window:resize', ['$event'])
  private chartSize(): void {
    const width = window.innerWidth;
    if (width <= 480) {
      this.chartView = [400, 300];
    } else if (width <= 768) {
      this.chartView = [450, 400];
    } else if (width <= 1024) {
      this.chartView = [800, 450];
    }
  }

  private getOlympicsData(data: any): void {
    const olympics = data ?? [];
    this.chartData = olympics.map((o: any) => ({
      name: o.country,
      value: o.participations.reduce((total: number, p: Participation) => total + (p.medalsCount || 0), 0)
    }));
  }


   // navigation vers la page détail au clic d'un pays
  Select(event: EventData): void {
    const name = this.getCountryName(event);
    this.router.navigate(['detail', encodeURIComponent(name)]);
  }


   private getCountryName(event: EventData): string {
      return event.name || event.value?.name || '';
    }
  // activation de la bulle d'infos
  onActivate(event: EventData): void {
const name = this.getCountryName(event);
    const value = this.olympicService.getMedalCount(name);
    this.hoverInfo = { name, value, x: 0, y: 0 };
  }
// bulle d'infos qui suit la souris
  onMouseMove(event: MouseEvent): void {
    const offsetX = -10;
    const offsetY = 60;

    if (this.hoverInfo) {
      this.hoverInfo = {
        ...this.hoverInfo,
        x: event.clientX + offsetX,
        y: event.clientY - offsetY
      };
    }
  }
  // désactivation de la bulle d'infos
  onDeactivate(): void {
    this.hoverInfo = undefined;
  }



  //Néttoyer les abonnements
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
