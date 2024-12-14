import { define, Form, InputArray, View, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { RaceResult, Athlete } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class ResultEditElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element
  });

  @property({ type: String, attribute: 'race-id' })
  raceId?: string;

  @property({ type: Number, attribute: 'athlete-id' })
  selectedAthlete?: number;

  @state()
  get raceResult(): RaceResult | undefined {
    return this.model.raceResult;
  }

  static styles = css`
    .mu-form {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        padding: 16px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .mu-form input[type="number"],
    .mu-form input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .mu-form input[type="number"]:focus,
    .mu-form input[type="text"]:focus {
        border-color: #007BFF;
        outline: none;
    }

    .mu-form input[type="submit"] {
        padding: 8px 16px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .mu-form input[type="submit"]:hover {
        background-color: #0056b3;
    }

    .mu-form input[type="submit"]:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .mu-form .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    @media (max-width: 600px) {
    .mu-form {
        padding: 8px;
    }

    .mu-form input[type="number"],
    .mu-form input[type="text"] {
        padding: 6px;
        font-size: 0.9rem;
    }

    .mu-form input[type="submit"] {
        padding: 6px 12px;
    }
    }
    `;

  render() {
    return html`
      <main class="page">
        <mu-form .init=${this._getFormInitData()} @mu-form:submit=${this._handleSubmit}>
          <input type="number" name="position" .value=${this._getAthletePosition()} @input=${this._handleInput} />
          <input type="text" name="name" .value=${this._getAthleteName()} @input=${this._handleInput} />
          <input type="text" name="team" .value=${this._getAthleteTeam()} @input=${this._handleInput} />
          <input type="text" name="time" .value=${this._getAthleteTime()} @input=${this._handleInput} />
          <input type="text" name="schoolYear" .value=${this._getAthleteSchoolYear()} @input=${this._handleInput} />
        </mu-form>
        <button @click=${this._navigateToRaceResults}>Cancel</button>
      </main>
    `;
  }

  _handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (this.selectedAthlete !== undefined && this.raceResult?.results[this.selectedAthlete]) {
      const updatedRaceResults = [...this.raceResult.results];

      switch (target.name) {
        case 'position':
          updatedRaceResults[this.selectedAthlete].position = Number(value);
          break;
        case 'time':
          updatedRaceResults[this.selectedAthlete].time = value;
          break;
        case 'team':
          updatedRaceResults[this.selectedAthlete].team = value; 
          break;
        case 'name':
          updatedRaceResults[this.selectedAthlete].name = value;
          break;
        case 'schoolYear':
          break;
        default:
          break;
      }

      this.model.raceResult = {
        ...this.raceResult,
        results: updatedRaceResults
      };
    }
  }

  _getFormInitData() {
    if (this.selectedAthlete !== undefined && this.raceResult?.results[this.selectedAthlete]) {
      // Initialize form with selected athlete's data
      return {
        ...this.raceResult.results[this.selectedAthlete],
        raceId: this.raceId
      };
    }
    return {};
  }

  _getAthletePosition() {
    if (this.selectedAthlete !== undefined && this.raceResult?.results[this.selectedAthlete]) {
      return this.raceResult.results[this.selectedAthlete].position;
    }
    return '';
  }

  _getAthleteName() {
    if (this.selectedAthlete !== undefined && this.raceResult?.results[this.selectedAthlete]) {
      return this.raceResult.results[this.selectedAthlete].name;
    }
    return '';
  }

  _getAthleteTeam() {
    if (this.selectedAthlete !== undefined && this.raceResult?.results[this.selectedAthlete]) {
      return this.raceResult.results[this.selectedAthlete].team;
    }
    return '';
  }

  _getAthleteTime() {
    if (this.selectedAthlete !== undefined && this.raceResult?.results[this.selectedAthlete]) {
      return this.raceResult.results[this.selectedAthlete].time;
    }
    return '';
  }

  _getAthleteSchoolYear() {
    if (this.selectedAthlete !== undefined && this.raceResult?.results[this.selectedAthlete]) {
      return this.raceResult.results[this.selectedAthlete].schoolYear;
    }
    return '';
  }


  _handleSubmit(event: Form.SubmitEvent<Athlete>) {
    console.log(this.selectedAthlete, this.raceId, event.detail);
    this.dispatchMessage([
      "result/save",
      {
        raceId: this.raceId || "",
        athleteId: this.selectedAthlete || 0,
        result: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/races/${this.raceId}`
          }),
        onFailure: (error: Error) => console.log("ERROR:", error)
      }
    ]);
  }

  _navigateToRaceResults() {
    History.dispatch(this, "history/navigate", {
      href: `/app/races/${this.raceId}`
    });
  }
}
