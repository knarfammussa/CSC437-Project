import { Athlete } from './athlete';

export interface RaceResult {
  raceId: string;
  raceName: string;
  results: Athlete[];
}