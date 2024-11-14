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
      stylesheets: [
        "/reset.css",
        "/tokens.css",
        "/styles/page.css",
        "/scripts/styles/reset.css.js"
      ],
      scripts: [
        `import { define } from "@calpoly/mustang";
            import { RaceResultsElement } from "/scripts/ind-results.js";
            import { TeamRaceResultsElement } from "/scripts/team-results.js";
        
            define({
              "ind-result": RaceResultsElement,
              "team-result": TeamRaceResultsElement
            });
              `
      ]
    });
  }
  renderRaceName() {
    const { raceName } = this.data;
    return import_server.html`
      <h2>
        <svg class="icon">
          <use href="/icons/running.svg#icon-track2"></use>
        </svg>
        ${raceName} Results
        <svg class="icon">
          <use href="/icons/running.svg#icon-track3"></use>
        </svg>
      </h2>
    `;
  }
  renderBody() {
    const { raceName, results, teamResults } = this.data;
    return import_server.html`
      <body>
        <header class="header">
          <nav class="logo"><a href="/index.html">App Logo</a></nav>
          <nav class="navigation">
            <ul>
              <li><a href="/races.html">Races</a></li>
              <li><a href="/results.html">Results</a></li>
              <li><a href="/runners.html">Runners</a></li>
              <li><a href="/teamresults.html">Team Results</a></li>
              <li><a href="/indresults.html">Individual Results</a></li>
            </ul>
          </nav>
          <div class="user-info">
            <span class="username">Username</span>
            <img src="" alt="User Avatar" class="avatar"> <!--update once path for avatar found-->
          </div>
        </header>

        ${this.renderRaceName()}

        ${this.renderRaceResults(this.data)}

        <a href="../races.html">Back to Meets</a>
      </body>
    `;
  }
  renderRaceResults(raceResult) {
    return import_server.html`<h2>Individual Results</h2>
    <div class="results-header">
      <span>Position</span>
      <span>Name</span>
      <span>Team</span>
      <span>Time</span>
      <span>School Year</span>
    </div>
    ${raceResult.results.map(
      (athlete) => this.renderAthleteResult(athlete)
    )}

    <h2>Team Results</h2>
    <div class="team-results-header">
        <span>Position</span>
        <span>Team</span>
        <span>Points</span>
        <span>Top Runner</span>
        <span>Team Time</span>
        <span>5-Man-Gap</span>
    </div>
    ${raceResult.teamResults.map(
      (teamResults) => this.renderTeamResult(teamResults)
    )}`;
  }
  renderAthleteResult(athlete) {
    const { position, name, team, time, schoolYear } = athlete;
    return import_server.html`
      <ind-result position="${position}" name="${name}">
        <span slot="team">${team}</span>
        <time slot="time">${time}</time>
        <span slot="school-year">${schoolYear}</span>
      </ind-result>
    `;
  }
  renderTeamResult(teamres) {
    const { position, teamName, points, topRunner, teamTime, fiveManGap } = teamres;
    return import_server.html`
        <team-result position="${position}" team="${teamName}">
            <span slot="points">${points}</span>
            <span slot="top-runner">${topRunner}</span>
            <time slot="team-time">${teamTime}</time>
            <time slot="five-man-gap">${fiveManGap}</slot>
        </team-result>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RaceResultPage
});
