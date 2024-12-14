import { RaceResult } from "server/models";

export type Msg =
  | ["result/save", { raceId: string; result: RaceResult, athleteId: number, onSuccess?: () => void;
    onFailure?: (err: Error) => void; }]
  | ["result/select", { raceId: string }]
  | ["athlete/select", { athleteId: string }]
  | ["team-result/update", { teamName: string; result: RaceResult }]
  | ["result/update", { raceId: string; result: RaceResult }];