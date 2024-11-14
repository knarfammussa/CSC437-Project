import { Athlete } from '../models/athlete';
import { RaceResult } from '../models/race-results';

const raceResults: RaceResult[] = [
  {
    raceId: "USF-2024",
    raceName: "USF Invitational - 8K",
    results: [
      {
        position: 1,
        name: "John Doe",
        team: "Team A",
        time: "25:30",
        schoolYear: "Senior",
      },
      {
        position: 2,
        name: "Jane Smith",
        team: "Team B",
        time: "25:45",
        schoolYear: "Junior",
      },
      {
        position: 3,
        name: "Alice Johnson",
        team: "Team A",
        time: "26:00",
        schoolYear: "Sophomore",
      },
    ],
    teamResults: [
      {
        position: 1,
        teamName: "Team A",
        points: 50,  // Hypothetical team score based on positions
        topRunner: "John Doe",
        teamTime: "2:10:00",  // Hypothetical overall team time
        fiveManGap: "2:00",  // Hypothetical gap between the 1st and 5th runners
      },
      {
        position: 2,
        teamName: "Team B",
        points: 55,  // Hypothetical team score based on positions
        topRunner: "Jane Smith",
        teamTime: "2:12:00",  // Hypothetical overall team time
        fiveManGap: "2:30",  // Hypothetical gap between the 1st and 5th runners
      },
    ],
  },
];


export function getRaceResult(raceId: string) {
    return raceResults.find((race) => race.raceId === raceId);
}