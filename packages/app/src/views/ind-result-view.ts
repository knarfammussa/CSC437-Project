import { Auth, Observer, History } from "@calpoly/mustang";
import { html, LitElement, css } from "lit";
import { property } from "lit/decorators.js";
//import { Model } from "../model";
//import { Msg } from "../messages";

export class IndViewElement extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Number }) position = 0;
  @property({ type: String }) name = 'Unknown Athlete';
  @property({ type: String }) team = 'N/A';
  @property({ type: String }) time = '00:00';
  @property({ type: String }) schoolYear = 'N/A';

  @property({ type: String, attribute: 'race-id' })
  raceId?: string;

  static styles = css`
    :host {
      display: grid;
    }

    .race-result-row {
      display: grid;
      grid-template-columns: 100px 1fr 1fr 100px 150px 50px;
      grid-template-rows: 30px;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding: 1px 0;
      background-color: #f9f9f9;
    }

    .race-result-row span,
    .race-result-row ::slotted(span),
    .race-result-row ::slotted(time),
    .race-result-row ::slotted(strong) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 8px;
      border-right: 1px solid #ddd;
    }

    .race-result-row span:last-child,
    .race-result-row ::slotted([slot="school-year"]) {
      border-right: none;
    }

    .position {
      font-weight: bold;
      text-align: center;
    }

    .name {
      font-size: 1.1em;
      color: #333;
      min-height: 10px;
      display: inline-block;
    }

    ::slotted(time) {
      font-weight: bold;
      color: #006400;
      border-right: 1px solid #ddd;
    }

    ::slotted([slot="team"]) {
      color: #555;
      border-right: 1px solid #ddd;
    }

    ::slotted([slot="school-year"]) {
      color: #333;
      text-align: center;
    }

    .edit-btn {
      padding: 4px 10px;
      background-color: #006400;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
      font-weight: bold;
      text-align: center;
      transition: background-color 0.3s ease, transform 0.2s ease;
      justify-self: center;
    }

    .edit-btn:hover {
      background-color: #004d00;
      transform: scale(1.05);
    }
  `;

  render() {
    return html`
      <div class="race-result-row">
        <span class="position">${this.position}</span>
        <span class="name">${this.name}</span>
        <span slot="team">${this.team}</span>
        <span>${this.time}</span>
        <span slot="school-year">${this.schoolYear}</span>
        <button id="edit" class="edit-btn @click=${this._navigateToEditView}">Edit</button>
    </div>
  `;
}

  hydrate(url: string) {
    fetch(url, { headers: Auth.headers(this._user) })
      .then(res => {
        if (res.status !== 200) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(json => {
        this.position = json.position;
        this.name = json.name;
        this.team = json.team;
        this.time = json.time;
        this.schoolYear = json.schoolYear;
      })
      .catch(error => console.error(`Failed to render data from ${url}:`, error));
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

    this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('edit', { bubbles: true })));
  }

  _navigateToEditView() {
    if (this.raceId && this.position !== undefined) {
      console.log("Navigating to edit view with URL:", `/app/races/${this.raceId}/${this.position}/edit`);
      History.dispatch(this, "history/navigate", {
        href: `/app/races/${this.raceId}/${this.position}/edit`
      });
    } else {
      console.error("Missing required parameters: raceId or athleteId.");
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "src" && oldValue !== newValue && newValue) {
      this.hydrate(newValue);
    }
  }

//   handleMessage(msg: Msg) {
//     if (msg[0] === "result/select" && msg[1].raceId) {
//       this.src = `/api/results/${msg[1].raceId}`;
//       this.hydrate(this.src);
//     }
//   }
}

//customElements.define("ind-view", IndViewElement);
