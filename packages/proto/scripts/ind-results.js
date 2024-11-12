import { css, html, shadow } from "@calpoly/mustang";

export class RaceResultsElement extends HTMLElement {
  // Define the HTML template
  static template = html`
    <template>
      <div class="race-result-row">
        <span class="position" part="position"><slot name="position"></slot></span>
        <span class="name" part="name"><slot name="name"></slot></span>
        <span class="team" part="team"><slot name="team"></slot></span>
        <time class="time" part="time"><slot name="time"></slot></time>
        <span class="school-year" part="school-year"><slot name="school-year"></slot></span>
      </div>
    </template>
  `;

  // Define the styles for a table-like row
  static styles = css`
    .race-result-row {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr 1fr 1fr;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }

    .race-result-row span,
    .race-result-row time {
      text-align: left;
      padding: 8px;
      font-weight: normal;
    }

    .race-result-row:nth-child(even) {
      background-color: #f4f4f4;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(RaceResultsElement.template)
      .styles(RaceResultsElement.styles);
  }
}

// Register the custom element
customElements.define("race-results", RaceResultsElement);
