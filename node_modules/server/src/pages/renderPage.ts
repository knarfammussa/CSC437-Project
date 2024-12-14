import {
    PageParts,
    renderWithDefaults
  } from "@calpoly/mustang/server";
  
  const defaults = {
    stylesheets: [
      "/reset.css",
      "/tokens.css",
      "/styles/page.css"
    ],
    styles: [],
    scripts: [
      `import { define, Auth } from "@calpoly/mustang";
      import { RaceResultsElement } from "/scripts/ind-results.js";
      import { TeamRaceResultsElement } from "/scripts/team-results.js";
      import { HeaderElement } from "/scripts/header.js";
  
      define({
        "ind-result": RaceResultsElement,
        "team-result": TeamRaceResultsElement,
        "app-header": HeaderElement,
        "mu-auth": Auth.Provider
      });
        `
    ],
    googleFontURL:
      "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,200;0,400;0,700;1,700&family=Merriweather:wght@400;700&display=swap",
    imports: {
      "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
    }
  };
  
  export default function renderPage(page: PageParts) {
    return renderWithDefaults(page, defaults);
  }