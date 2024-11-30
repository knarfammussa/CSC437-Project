import { css, html, shadow, Observer, Events } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class HeaderElement extends HTMLElement {
  static template = html`
    <template>
        <header class="header">
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
            <label for="dark-mode-toggle" onchange="relayEvent(event)">
                <input type="checkbox" id="dark-mode-toggle" autocomplete="off">
                Dark Mode
            </label>
            <div class="user-info">
                <span id="userid"></span>
                <button id="signout" disabled>Sign Out</button>
            </div>
        </header> 
    </template>
  `;

  static styles = css`
    .header {
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

//   .race-result-row:nth-child(even) {
//     background-color: #f4f4f4;
//   }

    constructor() {
        super();
        shadow(this)
        .template(HeaderElement.template)
        .styles(HeaderElement.styles);

        this._userid = this.shadowRoot.querySelector("#userid");
        this._signout = this.shadowRoot.querySelector("#signout");
    
        // Wait until the user info and signout button are available
        if (this._signout) {
            this._signout.addEventListener("click", (event) =>
                Events.relay(event, "auth:message", ["auth/signout"])
            );
        }
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
        // console.log("entries: ", entries);
        // const toSlot = ([key, value]) => 
        //   html`<span slot="${key}">${value}</span>`
    
        // const fragment = entries.map(toSlot);
        // this.replaceChildren(...fragment);
        entries.forEach(([key, value]) => {
            const slotElement = this.shadowRoot.querySelector(`[slot="${key}"]`);
            if (slotElement) {
                if (slotElement.tagName === 'IMG') {
                    slotElement.src = value; // For avatar images
                } else {
                    slotElement.textContent = value; // For text slots
                }
            }
        });
    }
  
    _authObserver = new Observer(this, "racing:auth");

    connectedCallback() {
        //console.log("Observer is being set up");
        // this.addEventListener('racing:auth', (event) => {
        //     console.log('Received racing:auth event:', event.detail.user);
        // });
        this._userid = this.shadowRoot.querySelector("#userid");
        if (this._userid) {
            // Initialize the user information here
            this._authObserver.observe(({ user }) => {
                if (user && user.username !== this.userid) {
                    this.userid = user.username;
                }
            });
        }
    }

    get userid() {
        //console.log("Getting user ID:", this._userid);
        return this._userid ? this._userid.textContent : null;
    }

    set userid(id) {
        //console.log('Setting userid to:', id)
        if (!this._userid) {
            console.log('Error: _userid element not found.');
            return;
        }
        if (id === "anonymous") {
            this._userid.textContent = "";
            this._signout.disabled = true;
        } else {
            this._userid.textContent = id;
            this._signout.disabled = false;
        }
    }
}

customElements.define('app-header', HeaderElement);