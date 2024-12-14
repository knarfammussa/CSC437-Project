import { LitElement, css, html } from "lit";
import { Events } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  render() {
    return html`
      <header>
        <nav class="logo"><a href = "/index.html">App Logo</a></nav>
        <nav class="navigation">
            <ul>
                <li><a href="races.html">Races</a></li>
                <li><a href="results.html">Results</a></li>
                <li><a href="runners.html">Runners</a></li>
                <li><a href="teamresults.html">Team Results</a></li>
                <li><a href="indresults.html">Individual Results</a></li>
            </ul>
        </nav>
        <label @change=${toggleDarkMode}>
            <input type="checkbox" id="dark-mode-toggle" autocomplete="off">
            Dark Mode
        </label>
        <div class="user-info">
            <span id="userid"></span>
            <button id="signout" disabled>Sign Out</button>
        </div>
      </header>
    `;
  }

  static styles = css`
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        font-family: 'Rubik', Arial, sans-serif;
        color: var(--color-text);
        background-color: var(--color-accent-inverted);
        border: 5px solid var(--color-text-heading);
        border-radius: 10px;
    }

    .logo {
        font-size: 1.5em;
        font-weight: bold;
    }

    .page-name {
        font-size: 1.2em;
        text-align: center;
    }

    .user-info {
        display: flex;
        align-items: center;
    }

    .username {
        margin-right: 10px;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 10px;
    }

    .navigation ul {
        display: flex;
        list-style: none;
        padding: 0;
        margin:0;
    }

    .navigation li {
        margin: 0 10px;
    }

    .navigation a {
        text-decoration: none;
        color: var(--color-link);
    }

    .navigation a:hover {
        text-decoration: underline;
    }
    a {
        text-decoration: none;
        color: var(--color-link);
    }
    a:hover {
        text-decoration: underline;
    }
  `;
}

function toggleDarkMode(ev: InputEvent) {
    const target = ev.target as HTMLElement;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
        const checked = target.checked;
        Events.relay(ev, "dark-mode", { checked });
    }
}
