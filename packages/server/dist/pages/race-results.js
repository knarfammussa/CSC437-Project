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
var race_results_exports = {};
__export(race_results_exports, {
  RaceResultPage: () => RaceResultPage
});
module.exports = __toCommonJS(race_results_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class RaceResultPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      scripts: [
        `import { define } from "@calpoly/mustang";
          import { RaceResultsElement } from "/scripts/ind-results.js";
          import { TeamRaceResultsElement } from "/scripts/team-results.js";
  
          define({
            "ind-result": RaceResultsElement,
            "team-result": TeamRaceResultsElement
          });`
      ]
    });
  }
  renderBody() {
    const { raceName, results } = this.data;
    return import_server.html`
      <h1>${raceName}</h1>
      <div class="results-list">
        ${this.renderRaceResults(this.data)}
      </div>
    `;
  }
  renderRaceResults(raceResult) {
    return raceResult.results.map(
      (athlete) => import_server.html`${this.renderAthleteResult(athlete)}`
    );
  }
  renderAthleteResult(athlete) {
    const { position, name, team, time, schoolYear } = athlete;
    return import_server.html`
      <race-result-row>
        <span slot="position">${position}</span>
        <span slot="name">${name}</span>
        <span slot="team">${team}</span>
        <span slot="time">${time}</span>
        <span slot="school-year">${schoolYear}</span>
      </race-result-row>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RaceResultPage
});
