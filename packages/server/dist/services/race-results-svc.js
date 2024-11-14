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
    raceId: { type: String, required: true },
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
var race_results_svc_default = { index, get };
