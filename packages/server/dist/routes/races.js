"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var races_exports = {};
__export(races_exports, {
  default: () => races_default
});
module.exports = __toCommonJS(races_exports);
var import_express = __toESM(require("express"));
var import_race_results_svc = __toESM(require("../services/race-results-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_race_results_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:raceId", (req, res) => {
  const { raceId } = req.params;
  import_race_results_svc.default.get(raceId).then((raceResult) => {
    if (raceResult) {
      res.json(raceResult);
    } else {
      res.status(404).send("Race not found");
    }
  }).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newRace = req.body;
  import_race_results_svc.default.create(newRace).then(
    (race) => res.status(201).json(race)
  ).catch((err) => res.status(500).send(err));
});
router.put("/:raceid", (req, res) => {
  const { raceid } = req.params;
  const newRace = req.body;
  import_race_results_svc.default.update(raceid, newRace).then((race) => res.json(race)).catch((err) => res.status(404).end());
});
router.delete("/:raceid", (req, res) => {
  const { raceid } = req.params;
  console.log(`Received delete request for raceId: ${raceid}`);
  import_race_results_svc.default.remove(raceid).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
router.get("/:raceId/individual-results", (req, res) => {
  const { raceId } = req.params;
  import_race_results_svc.default.getIndividualResults(raceId).then((results) => res.json(results)).catch((err) => {
    console.error(err);
    res.status(404).send(`Individual results for race ${raceId} not found`);
  });
});
router.get("/:raceId/team-results", (req, res) => {
  const { raceId } = req.params;
  import_race_results_svc.default.getTeamResults(raceId).then((results) => res.json(results)).catch((err) => {
    console.error(err);
    res.status(404).send(`Team results for race ${raceId} not found`);
  });
});
router.get("/:raceId/individual-results/:athleteId", (req, res) => {
  const { raceId } = req.params;
  const athleteId = parseInt(req.params.athleteId, 10);
  import_race_results_svc.default.getIndividualResult(raceId, athleteId).then((results) => res.json(results)).catch((err) => {
    console.error(err);
    res.status(404).send(`Individual results for race ${raceId} not found`);
  });
});
router.get("/:raceId/team-results/:teamId", (req, res) => {
  const { raceId } = req.params;
  const teamId = parseInt(req.params.teamId, 10);
  import_race_results_svc.default.getTeamResult(raceId, teamId).then((results) => res.json(results)).catch((err) => {
    console.error(err);
    res.status(404).send(`Team results for race ${raceId} not found`);
  });
});
var races_default = router;
