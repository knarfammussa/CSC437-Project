import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class RaceResultsElement extends HTMLElement {
  static template = html`
    <template>
      <div class="race-result-row">
        <slot name="position"></slot>
        <slot name="name"></slot>
        <slot name="team"></slot>
        <slot name="time"></slot>
        <slot name="schoolYear"></slot>
      </div>
    </template>
  `;

  static styles = css`
    .race-result-row {
      display: grid;
      grid-template-columns: 100px 1fr 1fr 100px 150px;
      grid-template-rows: 30px;
      gap: 16px;
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
  `;

//   .race-result-row:nth-child(even) {
//     background-color: #f4f4f4;
//   }

  constructor() {
    super();
    shadow(this)
      .template(RaceResultsElement.template)
      .styles(reset.styles, RaceResultsElement.styles);
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
    console.log("entries: ", entries);
    const toSlot = ([key, value]) => 
      html`<span slot="${key}">${value}</span>`
  
    const fragment = entries.map(toSlot);
    this.replaceChildren(...fragment);
  }
  
  connectedCallback() {
    if (this.src) this.hydrate(this.src);
    console.log("before render in connectedCallback");
    //this.renderAttributes();
  }

  static get observedAttributes() {
    return ["position", "name"];
  }

  attributeChangedCallback() {
    console.log("before render in attributeChanged...");
    //this.renderAttributes();
  }

  renderAttributes() {
    console.log("Position:", this.getAttribute("position"));
    console.log("Name:", this.getAttribute("name"));
    console.log("initial after render");

    if (this.shadowRoot) {
      const positionElement = this.shadowRoot.querySelector(".position");
      const nameElement = this.shadowRoot.querySelector(".name");

      if (positionElement) {
        positionElement.textContent = this.getAttribute("position") || "N/A";
      }
      if (nameElement) {
        nameElement.textContent = this.getAttribute("name") || "Unknown Athlete";
      }
    }
  }
}

if (!customElements.get('ind-result')) {
  customElements.define('ind-result', RaceResultsElement);
}