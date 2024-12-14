import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { RaceResult } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
//import styles from ".../public/styles/page.css"

export class RaceViewElement extends View<Model, Msg> {
  @property({ type: String, attribute: 'race-id' })
  raceId?: string;

  @state()
  get raceData(): RaceResult | undefined {
    return this.model.raceResult;
  }

  constructor() {
    super("racing:model");
  }

  static styles = css`
    h2 {
        font-family: 'Rubik', Arial, sans-serif;
        color: var(--color-text);
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    svg.icon {
        display: inline;
        height: 2em;
        width: 2em;
        vertical-align: middle;
        fill: currentColor;
    }
    .results-header {
        display: grid;
        grid-template-columns: 100px 1fr 1fr 100px 150px 50px;
        grid-template-rows: 30px;
        gap: 16px;
        align-items: center;
        font-weight: bold;
        text-transform: uppercase;
        background-color: var(--color-accent);
        padding: 8px 0;
        border-bottom: 2px solid #333;
        margin-bottom: 10px;
        border-radius: 10px;
    }
    .results-header span {
        text-align: left;
    }

    .results-header span:first-child {
        padding-left: 12px;
    }

    .team-results-header {
        display: grid;
        grid-template-columns: 100px 1fr 100px 1fr 100px 150px;
        grid-template-rows: 30px;
        gap: 16px;
        align-items: center;
        font-weight: bold;
        text-transform: uppercase;
        background-color: var(--color-accent);
        padding: 8px 0;
        border-bottom: 2px solid #333;
        margin-bottom: 10px;
        border-radius: 10px;
    }
    .team-results-header span {
        text-align: left;
    }

    .team-results-header span:first-child {
        padding-left: 12px;
    }
    
    `;

  render() {
    if (!this.raceData) {
      return html`
        <main class="page">
          <p>Loading race data...</p>
        </main>
      `;
    }

    return html`
      <main class="page">
        ${this.renderRaceName()}
        ${this.renderRaceResults(this.raceData)}
        <a href="../">Back to Meets</a>
      </main>
    `;
  }

  renderRaceName() {
    return html`
      <h2>
        <svg class="icon">
          <use href="/icons/running.svg#icon-track2"></use>
        </svg>
        ${this.raceData?.raceName} Results
        <svg class="icon">
          <use href="/icons/running.svg#icon-track3"></use>
        </svg>
      </h2>
    `;
  }

  renderRaceResults(raceResult: RaceResult) {
    return html`
      <section>
        <h2>Individual Results</h2>
        <div class="results-header">
            <span>Position</span>
            <span>Name</span>
            <span>Team</span>
            <span>Time</span>
            <span>School Year</span>
        </div>
        ${raceResult.results.map(
          (result) => html`
            <ind-view
              src="/api/races/${raceResult.raceId}/individual-results/${result.position}" race-id=${raceResult.raceId}
            ></ind-view>
          `
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
          (teamResult) => html`
            <team-view
              src="/api/races/${raceResult.raceId}/team-results/${teamResult.position}"
            ></team-view>
          `
        )}
      </section>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.raceId) {
      this.dispatchMessage(["result/select", { raceId: this.raceId }]);
    }
  }

  static get observedAttributes() {
    return ['race-id'];
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "race-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["result/select", { raceId: newValue }]);
    }
  }
}
