import { css, html } from "@calpoly/mustang/server";
import { RaceResult } from "../models/race-results";
import { Athlete } from "../models/athlete";
import renderPage from "./renderPage";

export class RaceResultPage {
  data: RaceResult;

  constructor(data: RaceResult) {
    this.data = data;
  }

  render() {
    return renderPage({
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
    return html`
      <h1>${raceName}</h1>
      <div class="results-list">
        ${this.renderRaceResults(this.data)}
      </div>
    `;
  }

  renderRaceResults(raceResult: RaceResult) {
    return raceResult.results.map(
      (athlete) => html`${this.renderAthleteResult(athlete)}`
    );
  }

  renderAthleteResult(athlete: Athlete) {
    const { position, name, team, time, schoolYear } = athlete;
    return html`
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
