import { Athlete } from './athlete';
import { TeamResult } from './team';

export interface RaceResult {
  raceId: string;
  raceName: string;
  results: Athlete[];
  teamResults: TeamResult[];
}