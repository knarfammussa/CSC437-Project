import { Auth, Observer } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { RaceResult } from "server/models"; // add Athlete, TeamResult
//import { Msg } from "../messages"; // ensure this points to your message definitions
//import { Model } from "./model";

export class HomeViewElement extends LitElement {
  src = "/api/races";

  @state()
  raceIndex: RaceResult[] = [];

  render() {
    if (this.raceIndex.length === 0) {
      return html`
        <main class="page">
          <header>
            <h2>Most Recent Races</h2>
          </header>
          <p>No race data available.</p>
        </main>
      `;
    }

    const raceList = this.raceIndex.map(this.renderItem);

    return html`
      <main class="page">
        <header>
          <h2>Most Recent Races</h2>
        </header>
        <dl>${raceList}</dl>
      </main>
    `;
  }

  hydrate(url: string) {
    fetch(url, {
      headers: Auth.headers(this._user),
    })
      .then((res: Response) => {
        if (res.status === 200) return res.json();
        throw `Server responded with status ${res.status}`;
      })
      .then((json: unknown) => {
        if (Array.isArray(json)) {
          this.raceIndex = json as RaceResult[];
        } else {
          console.log("Unexpected response format:", json);
        }
      })
      .catch((err) => console.log("Failed to load race data:", err));
  }

  _authObserver = new Observer<Auth.Model>(this, "racing:auth");

  _user = new Auth.User();

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this._user = user;
      }
      this.hydrate(this.src);
    });
  }

  renderItem(race: RaceResult) {
    return html`
      <dt><a href="/app/races/${race.raceId}" class="race-link">${race.raceName}</a></dt>
    `;
  }

//   handleMessage(msg: Msg) {
//     switch (msg[0]) {
//       case "result/select":
//         this.handleRaceSelection(msg[1].raceId);
//         break;
//       case "result/save":
//         // Handle result save logic
//         break;
//       case "athlete/select":
//         // Handle athlete selection logic
//         break;
//       default:
//         console.warn(`Unhandled message type: ${msg[0]}`);
//     }
//   }

//   handleRaceSelection(raceId: string) {
//     this.hydrate(`/api/races/${raceId}`);
//   }
}
