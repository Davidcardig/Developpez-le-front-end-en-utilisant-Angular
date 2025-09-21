import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  chartData: any[] = [];
  numberJO?: number;
  numberCountries?: number;
  hoverInfo?: { name: string; value: number; x: number; y: number }
      constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe(olympics => {
      this.getOlympicsData();
      this.numberJO = new Set(olympics?.flatMap(item => item.participations.map((p: any) => p.year))).size;
      this.numberCountries = new Set(olympics?.map(item => item.country)).size;
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

  // activation de la bulle d'infos
  onActivate(event: any): void {
    const name = this.olympicService.getCountryName(event);
    const value = this.olympicService.getMedalCount(name);
    this.hoverInfo = { name, value, x: 0, y: 0 };
  }

  // désactivation de la bulle d'infos
  onDeactivate(_: any): void {
    this.hoverInfo = undefined;
  }

  // bulle d'infos qui suit la souris
  onMouseMove(evt: MouseEvent): void {
    const offsetX = -10;
    const offsetY = 60;

    if (this.hoverInfo) {

      this.hoverInfo = {
        ...this.hoverInfo,
        x: evt.clientX + offsetX,
        y: evt.clientY - offsetY
      };
    }
  }

}
