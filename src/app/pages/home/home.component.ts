import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  chartData: any[] = [];
  public olympics$: Observable<any> = of(null);
  numberOfJOs: number = 0;
  numberOfCountries: number = 0;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe(data => {
      this.getOlympicsData();
    });
  }

  public getOlympicsData(): void {
    this.olympicService.getOlympics().subscribe(data => {
      const olympics = data ?? [];
      this.chartData = olympics.map(item => ({
        name: item.country,
        value: item.participations.reduce((total, p) => total + (p.medalsCount || 0), 0)
      }));
    
    });

  }

  
}