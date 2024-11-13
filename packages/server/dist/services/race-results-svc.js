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
  getRaceResult: () => getRaceResult
});
module.exports = __toCommonJS(race_results_svc_exports);
const raceResults = [
  {
    raceId: "1",
    raceName: "Cross Country Race - 5K",
    results: [
      {
        position: 1,
        name: "John Doe",
        team: "Team A",
        time: "15:30",
        schoolYear: "Senior"
      },
      {
        position: 2,
        name: "Jane Smith",
        team: "Team B",
        time: "15:45",
        schoolYear: "Junior"
      },
      {
        position: 3,
        name: "Alice Johnson",
        team: "Team A",
        time: "16:00",
        schoolYear: "Sophomore"
      }
    ]
  }
];
function getRaceResult(raceId) {
  return raceResults.find((race) => race.raceId === raceId);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRaceResult
});
