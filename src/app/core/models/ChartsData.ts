export interface EventData {
    value? : { name: string; };
      name: string;
}
   

export interface HoverInfo {
  name: string;
  value: number;
  x: number;
  y: number;
}

export interface DetailsData {
  medalsSeries: EventData[];
  totalParticipations: number;
  totalMedals: number;
  totalAthletes: number;
}