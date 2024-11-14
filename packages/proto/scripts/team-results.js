import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class TeamRaceResultsElement extends HTMLElement {
  static template = html`
    <template>
      <div class="team-race-result-row">
        <slot name="position"></slot>
        <slot name="teamName"></slot>
        <slot name="points"></slot>
        <slot name="topRunner"></slot>
        <slot name="teamTime"></slot>
        <slot name="fiveManGap"></slot>
      </div>
    </template>
  `;

  static styles = css`
    .team-race-result-row {
      display: grid;
      grid-template-columns: 100px 1fr 100px 1fr 100px 150px;
      grid-template-rows: 30px;
      gap: 16px;
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
    .team {
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
  `;

//   .race-result-row:nth-child(even) {
//     background-color: #f4f4f4;
//   }

  constructor() {
    super();
    shadow(this)
      .template(TeamRaceResultsElement.template)
      .styles(reset.styles, TeamRaceResultsElement.styles);
  }

  get src() {
    return this.getAttribute("src");
  }

  hydrate(url) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
      .catch((error) =>
        console.log(`Failed to render data ${url}:`, error)
      );
  }

  renderSlots(json) {
    const entries = Object.entries(json);
    const toSlot = ([key, value]) =>
      html`<span slot="${key}">${value}</span>`
  
    const fragment = entries.map(toSlot);
    this.replaceChildren(...fragment);
  }
  
  connectedCallback() {
    //this.renderAttributes();
    if (this.src) this.hydrate(this.src);
  }

  static get observedAttributes() {
    return ["position", "team"];
  }

  attributeChangedCallback() {
    //this.renderAttributes();
  }

  renderAttributes() {
    console.log("Position:", this.getAttribute("position"));
    console.log("Team:", this.getAttribute("team"));

    if (this.shadowRoot) {
      const positionElement = this.shadowRoot.querySelector(".position");
      const nameElement = this.shadowRoot.querySelector(".team");

      if (positionElement) {
        positionElement.textContent = this.getAttribute("position") || "N/A";
      }
      if (nameElement) {
        nameElement.textContent = this.getAttribute("team") || "Unknown Team";
      }
    }
  }
}

if (!customElements.get('team-result')) {
  customElements.define('team-result', TeamRaceResultsElement);
}
