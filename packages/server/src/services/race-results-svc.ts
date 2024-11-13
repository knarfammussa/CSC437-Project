import { Athlete } from '../models/athlete';
import { RaceResult } from '../models/race-results';

const raceResults: RaceResult[] = [
  {
    raceId: "1",
    raceName: "Cross Country Race - 5K",
    results: [
      {
        position: 1,
        name: "John Doe",
        team: "Team A",
        time: "15:30",
        schoolYear: "Senior",
      },
      {
        position: 2,
        name: "Jane Smith",
        team: "Team B",
        time: "15:45",
        schoolYear: "Junior",
      },
      {
        position: 3,
        name: "Alice Johnson",
        team: "Team A",
        time: "16:00",
        schoolYear: "Sophomore",
      },
    ],
  },
];

export function getRaceResult(raceId: string) {
    return raceResults.find((race) => race.raceId === raceId);
}