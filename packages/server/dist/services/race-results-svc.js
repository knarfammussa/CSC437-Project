"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var race_results_svc_exports = {};
__export(race_results_svc_exports, {
  default: () => race_results_svc_default
});
module.exports = __toCommonJS(race_results_svc_exports);
var import_mongoose = require("mongoose");
const AthleteSchema = new import_mongoose.Schema(
  {
    position: { type: Number, required: true },
    name: { type: String, required: true },
    team: { type: String, required: true },
    time: { type: String, required: true },
    schoolYear: { type: String, required: true }
  },
  { _id: false }
);
const TeamResultSchema = new import_mongoose.Schema(
  {
    position: { type: Number, required: true },
    teamName: { type: String, required: true },
    points: { type: Number, required: true },
    topRunner: { type: String, required: true },
    teamTime: { type: String, required: true },
    fiveManGap: { type: String, required: true }
  },
  { _id: false }
);
const RaceResultSchema = new import_mongoose.Schema(
  {
    raceId: { type: String, required: true, unique: true },
    raceName: { type: String, required: true },
    results: [AthleteSchema],
    teamResults: [TeamResultSchema]
  },
  { timestamps: true }
);
const raceResults = (0, import_mongoose.model)("RaceResult", RaceResultSchema);
function index() {
  return raceResults.find();
}
function get(raceId) {
  return raceResults.findOne({ raceId }).then((result) => {
    if (!result) {
      throw new Error(`Race with ID ${raceId} not found`);
    }
    return result;
  }).catch((err) => {
    throw new Error(`Error fetching race result: ${err.message}`);
  });
}
function create(json) {
  const t = new raceResults(json);
  return t.save();
}
function update(raceId, race) {
  return raceResults.findOneAndUpdate({ raceId }, race, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${raceId} not updated`;
    else return updated;
  });
}
function remove(raceId) {
  console.log(`remove function: ${JSON.stringify(raceId)}`);
  return raceResults.findOneAndDelete({ raceId }).then(
    (deleted) => {
      if (!deleted) throw `${raceId} not deleted`;
    }
  );
}
function getIndividualResults(raceId) {
  return raceResults.findOne({ raceId }).then((race) => {
    if (!race) {
      throw new Error(`Race with ID ${raceId} not found`);
    }
    return {
      results: race.results
    };
  }).catch((err) => {
    throw new Error(`Error fetching individual results: ${err.message}`);
  });
}
function getTeamResults(raceId) {
  return raceResults.findOne({ raceId }).then((race) => {
    if (!race) {
      throw new Error(`Race with ID ${raceId} not found`);
    }
    return {
      results: race.teamResults
    };
  }).catch((err) => {
    throw new Error(`Error fetching individual results: ${err.message}`);
  });
}
function getIndividualResult(raceId, athleteId) {
  return raceResults.findOne(
    { raceId, "results.position": athleteId },
    { "results.$": 1 }
  ).then((race) => {
    if (!race || !race.results || race.results.length === 0) {
      throw new Error(`Athlete with ID ${athleteId} not found in race ${raceId}`);
    }
    return race.results[0];
  }).catch((err) => {
    console.error(`Error fetching result for athlete ${athleteId} in race ${raceId}: ${err.message}`);
    throw new Error(`Error fetching individual result: ${err.message}`);
  });
}
function getTeamResult(raceId, teamPosition) {
  return raceResults.findOne(
    { raceId, "teamResults.position": teamPosition },
    { "teamResults.$": 1 }
  ).then((race) => {
    if (!race || !race.teamResults || race.teamResults.length === 0) {
      throw new Error(`Team with position ${teamPosition} not found in race ${raceId}`);
    }
    return race.teamResults[0];
  }).catch((err) => {
    console.error(`Error fetching result for team at position ${teamPosition} in race ${raceId}: ${err.message}`);
    throw new Error(`Error fetching team result: ${err.message}`);
  });
}
var race_results_svc_default = { index, get, create, update, remove, getIndividualResults, getTeamResults, getIndividualResult, getTeamResult };
