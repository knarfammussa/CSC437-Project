import { Auth, Store, History, Switch, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { HeaderElement } from "./components/racing-header";
import { HomeViewElement } from "./views/home-view";
import { RaceViewElement } from "./views/race-view";
import { IndViewElement } from "./views/ind-result-view";
import { TeamViewElement } from "./views/team-result-view";
import { ResultEditElement } from "./components/result-edit";

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement
  });

  protected render() {
    return html`
      <home-view></home-view>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // HeaderElement.initializeOnce();
  }
}

const routes = [
    {
      path: "/app/races/:raceId",
      view: (params: Switch.Params) => html`
        <race-view race-id=${params.raceId}></race-view>
      `
    },
    {
      path: "/app",
      view: () => html`
        <home-view></home-view>
      `
    },
    {
      path: "/app/races/:raceId/:athleteId/edit",
      view: (params: Switch.Params) => html`
        <edit-view race-id=${params.raceId} athlete-id=${params.athleteId}></edit-view>
      `
    },
    {
      path: "/",
      redirect: "/app"
    }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "racing:history", "racing:auth");
    }
  },
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "racing:auth");
    }
  },
  "racing-app": AppElement,
  "racing-header": HeaderElement,
  "home-view": HomeViewElement,
  "race-view": RaceViewElement,
  "ind-view": IndViewElement,
  "team-view": TeamViewElement,
  "edit-view": ResultEditElement
});