import { Athlete, RaceResult, TeamResult } from "server/models";

export interface Model {
  athlete?: Athlete;
  raceResult?: RaceResult;
  teamResult?: TeamResult;
}

export const init: Model = {};