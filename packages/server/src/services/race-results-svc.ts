import { Athlete } from '../models/athlete';
import { TeamResult } from '../models/team';
import { RaceResult } from '../models/race-results';
import { Schema, model } from "mongoose";

const AthleteSchema = new Schema<Athlete>(
  {
    position: {type: Number, required: true},
    name: {type: String, required: true},
    team: {type: String, required: true},
    time: {type: String, required: true},
    schoolYear: {type: String, required: true}
  },
  { _id: false }
);

const TeamResultSchema = new Schema<TeamResult>(
  {
    position: { type: Number, required: true },
    teamName: { type: String, required: true },
    points: { type: Number, required: true },
    topRunner: { type: String, required: true },
    teamTime: { type: String, required: true },
    fiveManGap: { type: String, required: true },
  },
  { _id: false }
);


const RaceResultSchema = new Schema<RaceResult>(
  {
    raceId: { type: String, required: true, unique: true},
    raceName: { type: String, required: true },
    results: [AthleteSchema],
    teamResults: [TeamResultSchema],
  },
  { timestamps: true }
);

const raceResults = model<RaceResult>("RaceResult", RaceResultSchema);

// const raceResults: RaceResult[] = [
//   {
//     raceId: "USF-2024",
//     raceName: "USF Invitational - 8K",
//     results: [
//       {
//         position: 1,
//         name: "John Doe",
//         team: "Team A",
//         time: "25:30",
//         schoolYear: "Senior",
//       },
//       {
//         position: 2,
//         name: "Jane Smith",
//         team: "Team B",
//         time: "25:45",
//         schoolYear: "Junior",
//       },
//       {
//         position: 3,
//         name: "Alice Johnson",
//         team: "Team A",
//         time: "26:00",
//         schoolYear: "Sophomore",
//       },
//     ],
//     teamResults: [
//       {
//         position: 1,
//         teamName: "Team A",
//         points: 50,  // Hypothetical team score based on positions
//         topRunner: "John Doe",
//         teamTime: "2:10:00",  // Hypothetical overall team time
//         fiveManGap: "2:00",  // Hypothetical gap between the 1st and 5th runners
//       },
//       {
//         position: 2,
//         teamName: "Team B",
//         points: 55,  // Hypothetical team score based on positions
//         topRunner: "Jane Smith",
//         teamTime: "2:12:00",  // Hypothetical overall team time
//         fiveManGap: "2:30",  // Hypothetical gap between the 1st and 5th runners
//       },
//     ],
//   },
// ];


// export function getRaceResult(raceId: string) {
//     return raceResults.find((race) => race.raceId === raceId);
// }

function index(): Promise<RaceResult[]> {
  return raceResults.find();
}

function get(raceId: string): Promise<RaceResult | null> {
  return raceResults.findOne({ raceId })
    .then((result) => {
      if (!result) {
        throw new Error(`Race with ID ${raceId} not found`);
      }
      return result;
    })
    .catch((err) => {
      throw new Error(`Error fetching race result: ${err.message}`);
    });
}

function create(json: RaceResult): Promise<RaceResult> {
  const t = new raceResults(json);
  return t.save();
}

function update(raceId: String, race: RaceResult): Promise<RaceResult> {
  return raceResults.findOneAndUpdate({ raceId }, race, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${raceId} not updated`;
    else return updated as RaceResult;
  });
}

function remove(raceId: String): Promise<void> {
  console.log(`remove function: ${JSON.stringify(raceId)}`);
  return raceResults.findOneAndDelete({ raceId }).then(
    (deleted) => {
      if (!deleted) throw `${raceId} not deleted`;
    }
  );
}
function getIndividualResults(raceId: String): Promise<any> {
  return raceResults.findOne({ raceId })
    .then((race) => {
      if (!race) {
        throw new Error(`Race with ID ${raceId} not found`);
      }
      return {
        results: race.results
      };
    })
    .catch((err) => {
      throw new Error(`Error fetching individual results: ${err.message}`);
    });
}

function getTeamResults(raceId: String): Promise<any> {
  return raceResults.findOne({ raceId })
    .then((race) => {
      if (!race) {
        throw new Error(`Race with ID ${raceId} not found`);
      }
      return {
        results: race.teamResults
      };
    })
    .catch((err) => {
      throw new Error(`Error fetching individual results: ${err.message}`);
    });
}

function getIndividualResult(raceId: String, athleteId: Number): Promise<any> {
  return raceResults
    .findOne(
      { raceId, "results.position": athleteId },
      { "results.$": 1 }
    )
    .then((race) => {
      if (!race || !race.results || race.results.length === 0) {
        throw new Error(`Athlete with ID ${athleteId} not found in race ${raceId}`);
      }
      return race.results[0];
    })
    .catch((err) => {
      console.error(`Error fetching result for athlete ${athleteId} in race ${raceId}: ${err.message}`);
      throw new Error(`Error fetching individual result: ${err.message}`);
    });
}

function getTeamResult(raceId: String, teamPosition: Number): Promise<any> {
  return raceResults
    .findOne(
      { raceId, "teamResults.position": teamPosition },
      { "teamResults.$": 1 }
    )
    .then((race) => {
      if (!race || !race.teamResults || race.teamResults.length === 0) {
        throw new Error(`Team with position ${teamPosition} not found in race ${raceId}`);
      }
      return race.teamResults[0];
    })
    .catch((err) => {
      console.error(`Error fetching result for team at position ${teamPosition} in race ${raceId}: ${err.message}`);
      throw new Error(`Error fetching team result: ${err.message}`);
    });
}


export default { index, get, create, update, remove, getIndividualResults, getTeamResults, getIndividualResult, getTeamResult };