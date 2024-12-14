import { Auth, Observer } from "@calpoly/mustang";
import { html, LitElement, css } from "lit";
import { property } from "lit/decorators.js";
//import { Msg } from "../messages"; // Adjust the path if necessary

export class TeamViewElement extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Number }) position = 0;
  @property({ type: String }) teamName = 'N/A';
  @property({ type: Number }) points = 0;
  @property({ type: String }) topRunner = 'Unknown Runner';
  @property({ type: String }) teamTime = '00:00';
  @property({ type: String }) fiveManGap = '00:00';


  static styles = css`
    :host {
      display: grid;
    }

    .team-race-result-row {
      display: grid;
      grid-template-columns: 100px 1fr 100px 1fr 100px 150px 50px;
      grid-template-rows: 30px;
      gap: 4px;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding: 1px 0;
      background-color: #f9f9f9;
    }

    .team-race-result-row span,
    .team-race-result-row ::slotted(span),
    .team-race-result-row ::slotted(team-time),
    .team-race-result-row ::slotted(strong) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 8px;
      border-right: 1px solid #ddd;
    }

    .team-race-result-row span:last-child,
    .team-race-result-row ::slotted([slot="five-man-gap"]) {
      border-right: none;
    }

    .position {
      font-weight: bold;
      text-align: center;
    }

    .teamName {
      font-size: 1.1em;
      color: #333;
      min-height: 10px;
      display: inline-block;
    }

    ::slotted(points) {
      color: #333;
    }

    ::slotted(team-time) {
      font-weight: bold;
      color: #006400;
      border-right: 1px solid #ddd;
    }

    ::slotted([slot="team-time"]) {
      color: #555;
      border-right: 1px solid #ddd;
    }

    ::slotted([slot="top-runner"]) {
      color: #333;
      text-align: left;
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
        <div class="team-race-result-row">
            <span class="position">${this.position}</span>
            <span class="teamName">${this.teamName}</span>
            <span slot="points">${this.points}</span>
            <span slot="topRunner">${this.topRunner}</span>
            <span slot="teamTime">${this.teamTime}</span>
            <span slot="fiveManGap">${this.fiveManGap}</span>
            <button id="edit" class="edit-btn">Edit</button>
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
        this.teamName = json.teamName;
        this.points = json.points;
        this.topRunner = json.topRunner;
        this.teamTime = json.teamTime;
        this.fiveManGap = json.fiveManGap;
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

customElements.define("team-view", TeamViewElement);
