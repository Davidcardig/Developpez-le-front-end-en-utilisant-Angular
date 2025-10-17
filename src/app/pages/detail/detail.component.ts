import { Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {EventData } from 'src/app/core/models/ChartsData';
import { SummaryCardComponent } from 'src/app/shared/components/summary-card/summary-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, SummaryCardComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  country = '';
  medalsSeries: EventData[] = [];
  totalParticipations = 0;
  totalMedals = 0;
  totalAthletes = 0;
  showBack = false;
  chartView: [number, number] = [900, 500];
 summaryCards: { name: string; value: number }[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
  this.showBack = this.router.url.includes('/detail');

  this.chartSize();
    const rawParam = this.route.snapshot.paramMap.get('country') ?? '';
    this.country = decodeURIComponent(rawParam);

    //console.log('Raw param from URL:', rawParam);
    //console.log('Decoded country name:', this.country);

    this.olympicService.getCountryDetails(this.country)
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(details => {
        //console.log('Service returned:', details);
        if (details) {
          this.medalsSeries = details.medalsSeries;
          this.summaryCards = [
            { name: 'Number of entries', value:  this.totalParticipations = details.totalParticipations },
            { name: 'Total number medals', value: this.totalMedals = details.totalMedals },
            { name: 'Total number of athletes', value: this.totalAthletes = details.totalAthletes },
          ];
        } else {
          this.router.navigate(['/not-found']);
        }
      });
  }


  // Mise à jour de la taille du graphique détail
  @HostListener('window:resize', ['$event'])
  private chartSize(): void {
    const width = window.innerWidth;
    if (width <= 480) {
      this.chartView = [400, 300];
    } else if (width <= 768) {
      this.chartView = [500, 400];
    } else if (width <= 1024) {
      this.chartView = [800, 450];
    }
  }

  //Navigation vers la page d'accueil
  goHome(): void {
    this.router.navigate(['/']);
  }

  //Néttoyer les abonnements
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
