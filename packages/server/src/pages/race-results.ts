import { css, html } from "@calpoly/mustang/server";
import { RaceResult } from "../models/race-results";
import { Athlete } from "../models/athlete";
import { TeamResult } from "../models/team";
import renderPage from "./renderPage";

export class RaceResultPage {
  data: RaceResult;

  constructor(data: RaceResult) {
    this.data = data;
  }

  render() {
    return renderPage({
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
          ],
      });
  }

  renderRaceName() {
    const { raceName } = this.data;
    return html`
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
    return html`
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

  renderRaceResults(raceResult: RaceResult) {
    // Render a list of individual athlete results
    return html`<h2>Individual Results</h2>
    <div class="results-header">
      <span>Position</span>
      <span>Name</span>
      <span>Team</span>
      <span>Time</span>
      <span>School Year</span>
    </div>
    ${raceResult.results.map(
      (athlete) => this.renderAthleteResult(athlete))}

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
      (teamResults) => this.renderTeamResult(teamResults))}`;

  }

  renderAthleteResult(athlete: Athlete) {
    const { position, name, team, time, schoolYear } = athlete;
    return html`
      <ind-result position="${position}" name="${name}">
        <span slot="team">${team}</span>
        <time slot="time">${time}</time>
        <span slot="school-year">${schoolYear}</span>
      </ind-result>
    `;
  }

  renderTeamResult(teamres: TeamResult) {
    const { position, teamName, points, topRunner, teamTime, fiveManGap } = teamres;
    return html`
        <team-result position="${position}" team="${teamName}">
            <span slot="points">${points}</span>
            <span slot="top-runner">${topRunner}</span>
            <time slot="team-time">${teamTime}</time>
            <time slot="five-man-gap">${fiveManGap}</slot>
        </team-result>
    `
  }
}