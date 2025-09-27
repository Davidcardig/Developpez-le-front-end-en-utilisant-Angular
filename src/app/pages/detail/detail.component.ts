import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {EventData } from 'src/app/core/models/ChartsData';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  country = '';
  medalsSeries: EventData[] = [];
  totalParticipations = 0;
  totalMedals = 0;
  totalAthletes = 0;
  chartView: [number, number] = [900, 500]; 
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.chartSize();
    const rawParam = this.route.snapshot.paramMap.get('country') ?? '';
    this.country = decodeURIComponent(rawParam);
    
    console.log('Raw param from URL:', rawParam);
    console.log('Decoded country name:', this.country);
    
    this.olympicService.getCountryDetails(this.country)
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        console.log('Service returned:', details);
        if (details) {
          this.medalsSeries = details.medalsSeries;
          this.totalParticipations = details.totalParticipations;
          this.totalMedals = details.totalMedals;
          this.totalAthletes = details.totalAthletes;
        } else {
          console.log('Country not found, navigating to not-found');
          // Gérer le cas où le pays n'est pas trouvé
          this.router.navigate(['/not-found']);
        }
      });
  }


  // Mise à jour de la taille du graphique détail
  @HostListener('window:resize', ['$event'])
  private chartSize(): void {
    const width = window.innerWidth;
    if (width <= 480) { 
      this.chartView = [450, 300];
    } else if (width <= 768) { 
      this.chartView = [600, 400];
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
