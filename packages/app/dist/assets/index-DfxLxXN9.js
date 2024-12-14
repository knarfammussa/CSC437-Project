(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var G,Oe;class ut extends Error{}ut.prototype.name="InvalidTokenError";function Gs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ks(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Gs(t)}catch{return atob(t)}}function os(r,t){if(typeof r!="string")throw new ut("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new ut(`Invalid token specified: missing part #${e+1}`);let i;try{i=Ks(s)}catch(n){throw new ut(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new ut(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Js="mu:context",Qt=`${Js}:change`;class Zs{constructor(t,e){this._proxy=Qs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ne extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Zs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Qt,t),t}detach(t){this.removeEventListener(Qt,t)}}function Qs(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Qt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function Xs(r,t){const e=as(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function as(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return as(r,i.host)}class ti extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ls(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ti(e,r))}class oe{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ei(r){return t=>({...t,...r})}const Xt="mu:auth:jwt",cs=class hs extends oe{constructor(t,e){super((s,i)=>this.update(s,i),t,hs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ii(s)),Yt(i);case"auth/signout":return e(ri()),Yt(this._redirectForLogin);case"auth/redirect":return Yt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};cs.EVENT_TYPE="auth:message";let us=cs;const ds=ls(us.EVENT_TYPE);function Yt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class si extends ne{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=tt.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new us(this.context,this.redirect).attach(this)}}class X{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Xt),t}}class tt extends X{constructor(t){super();const e=os(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new tt(t);return localStorage.setItem(Xt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Xt);return t?tt.authenticate(t):new X}}function ii(r){return ei({user:tt.authenticate(r),token:r})}function ri(){return r=>{const t=r.user;return{user:t&&t.authenticated?X.deauthenticate(t):t,token:""}}}function ni(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function oi(r){return r.authenticated?os(r.token||""):{}}const R=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:tt,Provider:si,User:X,dispatch:ds,headers:ni,payload:oi},Symbol.toStringTag,{value:"Module"}));function Ct(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function te(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ai=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:te,relay:Ct},Symbol.toStringTag,{value:"Module"}));function ps(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const li=new DOMParser;function D(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=li.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Te(a);case"bigint":case"boolean":case"number":case"symbol":return Te(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Te(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ht(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let ci=(G=class extends HTMLElement{constructor(){super(),this._state={},Ht(this).template(G.template).styles(G.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Ct(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},hi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},G.template=D`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,G.styles=ps`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,G);function hi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const ui=Object.freeze(Object.defineProperty({__proto__:null,Element:ci},Symbol.toStringTag,{value:"Module"})),fs=class ms extends oe{constructor(t){super((e,s)=>this.update(e,s),t,ms.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(pi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(fi(s,i));break}}}};fs.EVENT_TYPE="history:message";let ae=fs;class Ne extends ne{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=di(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),le(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ae(this.context).attach(this)}}function di(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function pi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function fi(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const le=ls(ae.EVENT_TYPE),Rt=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ne,Provider:Ne,Service:ae,dispatch:le},Symbol.toStringTag,{value:"Module"}));class U{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ue(this._provider,t);this._effects.push(i),e(i)}else Xs(this._target,this._contextLabel).then(i=>{const n=new Ue(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ue{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const gs=class ys extends HTMLElement{constructor(){super(),this._state={},this._user=new X,this._authObserver=new U(this,"blazing:auth"),Ht(this).template(ys.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;mi(i,this._state,e,this.authorization).then(n=>at(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},at(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ie(this.src,this.authorization).then(e=>{this._state=e,at(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ie(this.src,this.authorization).then(i=>{this._state=i,at(i,this)});break;case"new":s&&(this._state={},at({},this));break}}};gs.observedAttributes=["src","new","action"];gs.template=D`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Ie(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function at(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function mi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const _s=class vs extends oe{constructor(t,e){super(e,t,vs.EVENT_TYPE,!1)}};_s.EVENT_TYPE="mu:message";let $s=_s;class gi extends ne{constructor(t,e,s){super(e),this._user=new X,this._updateFn=t,this._authObserver=new U(this,s)}connectedCallback(){const t=new $s(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const yi=Object.freeze(Object.defineProperty({__proto__:null,Provider:gi,Service:$s},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,ce=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),Me=new WeakMap;let bs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Me.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Me.set(e,t))}return t}toString(){return this.cssText}};const _i=r=>new bs(typeof r=="string"?r:r+"",void 0,he),vi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new bs(e,r,he)},$i=(r,t)=>{if(ce)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Pt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Le=ce?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return _i(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:bi,defineProperty:Ai,getOwnPropertyDescriptor:wi,getOwnPropertyNames:xi,getOwnPropertySymbols:Ei,getPrototypeOf:Si}=Object,et=globalThis,He=et.trustedTypes,Pi=He?He.emptyScript:"",je=et.reactiveElementPolyfillSupport,dt=(r,t)=>r,Ot={toAttribute(r,t){switch(t){case Boolean:r=r?Pi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ue=(r,t)=>!bi(r,t),ze={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),et.litPropertyMetadata??(et.litPropertyMetadata=new WeakMap);let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ai(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=wi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ze}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Si(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,s=[...xi(e),...Ei(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Le(i))}else t!==void 0&&e.push(Le(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $i(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ot).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ot;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ue)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[dt("elementProperties")]=new Map,J[dt("finalized")]=new Map,je==null||je({ReactiveElement:J}),(et.reactiveElementVersions??(et.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Nt=Tt.trustedTypes,De=Nt?Nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,As="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,ws="?"+O,ki=`<${ws}>`,F=document,mt=()=>F.createComment(""),gt=r=>r===null||typeof r!="object"&&typeof r!="function",de=Array.isArray,Ci=r=>de(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Wt=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Be=/>/g,L=RegExp(`>|${Wt}(?:([^\\s"'>=/]+)(${Wt}*=${Wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,Ve=/"/g,xs=/^(?:script|style|textarea|title)$/i,Ri=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ct=Ri(1),st=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ye=new WeakMap,j=F.createTreeWalker(F,129);function Es(r,t){if(!de(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return De!==void 0?De.createHTML(t):t}const Oi=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=lt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===lt?f[1]==="!--"?o=Fe:f[1]!==void 0?o=Be:f[2]!==void 0?(xs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=i??lt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?Ve:qe):o===Ve||o===qe?o=L:o===Fe||o===Be?o=lt:(o=L,i=void 0);const h=o===L&&r[l+1].startsWith("/>")?" ":"";n+=o===lt?a+ki:u>=0?(s.push(d),a.slice(0,u)+As+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Es(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ee=class Ss{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Oi(t,e);if(this.el=Ss.createElement(d,s),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=j.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(As)){const c=f[o++],h=i.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ni:p[1]==="?"?Ui:p[1]==="@"?Ii:jt}),i.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(xs.test(i.tagName)){const u=i.textContent.split(O),c=u.length-1;if(c>0){i.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],mt()),j.nextNode(),a.push({type:2,index:++n});i.append(u[c],mt())}}}else if(i.nodeType===8)if(i.data===ws)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=F.createElement("template");return s.innerHTML=t,s}};function it(r,t,e=r,s){var i,n;if(t===st)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=gt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=it(r,o._$AS(r,t.values),o,s)),t}class Ti{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??F).importNode(e,!0);j.currentNode=i;let n=j.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new bt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Mi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=j.nextNode(),o++)}return j.currentNode=F,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class bt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),gt(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ci(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ee.createElement(Es(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ti(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ye.get(t.strings);return e===void 0&&Ye.set(t.strings,e=new ee(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new bt(this.O(mt()),this.O(mt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class jt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=it(this,l[s+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===v?t=v:t!==v&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ni extends jt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}}class Ui extends jt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}}class Ii extends jt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??v)===st)return;const s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}}const We=Tt.litHtmlPolyfillSupport;We==null||We(ee,bt),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Li=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new bt(t.insertBefore(mt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Q=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Li(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return st}};Q._$litElement$=!0,Q.finalized=!0,(Oe=globalThis.litElementHydrateSupport)==null||Oe.call(globalThis,{LitElement:Q});const Ge=globalThis.litElementPolyfillSupport;Ge==null||Ge({LitElement:Q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hi={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ue},ji=(r=Hi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Ps(r){return(t,e)=>typeof e=="object"?ji(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ks(r){return Ps({...r,state:!0,attribute:!1})}function zi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Di(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Cs={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Dt){var x=y.length-1;switch(m){case 1:return new g.Root({},[y[x-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[x-1],y[x]]);break;case 4:case 5:this.$=y[x];break;case 6:this.$=new g.Literal({value:y[x]});break;case 7:this.$=new g.Splat({name:y[x]});break;case 8:this.$=new g.Param({name:y[x]});break;case 9:this.$=new g.Optional({},[y[x-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Dt="",x=0,ke=0,qs=2,Ce=1,Vs=m.slice.call(arguments,1),_=Object.create(this.lexer),I={yy:{}};for(var Ft in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ft)&&(I.yy[Ft]=this.yy[Ft]);_.setInput(c,I.yy),I.yy.lexer=_,I.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Bt=_.yylloc;m.push(Bt);var Ys=_.options&&_.options.ranges;typeof I.yy.parseError=="function"?this.parseError=I.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ws=function(){var W;return W=_.lex()||Ce,typeof W!="number"&&(W=h.symbols_[W]||W),W},w,M,E,qt,Y={},Et,k,Re,St;;){if(M=p[p.length-1],this.defaultActions[M]?E=this.defaultActions[M]:((w===null||typeof w>"u")&&(w=Ws()),E=y[M]&&y[M][w]),typeof E>"u"||!E.length||!E[0]){var Vt="";St=[];for(Et in y[M])this.terminals_[Et]&&Et>qs&&St.push("'"+this.terminals_[Et]+"'");_.showPosition?Vt="Parse error on line "+(x+1)+`:
`+_.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Vt="Parse error on line "+(x+1)+": Unexpected "+(w==Ce?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Vt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Bt,expected:St})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),w=null,ke=_.yyleng,Dt=_.yytext,x=_.yylineno,Bt=_.yylloc;break;case 2:if(k=this.productions_[E[1]][1],Y.$=g[g.length-k],Y._$={first_line:m[m.length-(k||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(k||1)].first_column,last_column:m[m.length-1].last_column},Ys&&(Y._$.range=[m[m.length-(k||1)].range[0],m[m.length-1].range[1]]),qt=this.performAction.apply(Y,[Dt,ke,x,I.yy,E[1],g,m].concat(Vs)),typeof qt<"u")return qt;k&&(p=p.slice(0,-1*k*2),g=g.slice(0,-1*k),m=m.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),g.push(Y.$),m.push(Y._$),Re=y[p[p.length-2]][p[p.length-1]],p.push(Re);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Di<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Cs);function K(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Rs={Root:K("Root"),Concat:K("Concat"),Literal:K("Literal"),Splat:K("Splat"),Param:K("Param"),Optional:K("Optional")},Os=Cs.parser;Os.yy=Rs;var Fi=Os,Bi=Object.keys(Rs);function qi(r){return Bi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Ts=qi,Vi=Ts,Yi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ns(r){this.captures=r.captures,this.re=r.re}Ns.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Wi=Vi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Yi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ns({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Gi=Wi,Ki=Ts,Ji=Ki({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Zi=Ji,Qi=Fi,Xi=Gi,tr=Zi;At.prototype=Object.create(null);At.prototype.match=function(r){var t=Xi.visit(this.ast),e=t.match(r);return e||!1};At.prototype.reverse=function(r){return tr.visit(this.ast,r)};function At(r){var t;if(this?t=this:t=Object.create(At.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Qi.parse(r),t}var er=At,sr=er,ir=sr;const rr=zi(ir);var nr=Object.defineProperty,Us=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&nr(t,e,i),i};const Is=class extends Q{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ct` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new rr(i.path)})),this._historyObserver=new U(this,e),this._authObserver=new U(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ct` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ds(this,"auth/redirect"),ct` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ct` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ct` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){le(this,"history/redirect",{href:t})}};Is.styles=vi`
    :host,
    main {
      display: contents;
    }
  `;let Ut=Is;Us([ks()],Ut.prototype,"_user");Us([ks()],Ut.prototype,"_match");const or=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),ar=class Ms extends HTMLElement{constructor(){if(super(),Ht(this).template(Ms.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ar.template=D`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const pe=class se extends HTMLElement{constructor(){super(),this._array=[],Ht(this).template(se.template).styles(se.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ls("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{te(t,"button.add")?Ct(t,"input-array:add"):te(t,"button.remove")&&Ct(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],cr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};pe.template=D`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;pe.styles=ps`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;let lr=pe;function cr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ls(e)))}function Ls(r,t){const e=r===void 0?D`<input />`:D`<input value="${r}" />`;return D`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const hr=Object.freeze(Object.defineProperty({__proto__:null,Element:lr},Symbol.toStringTag,{value:"Module"}));function fe(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ur=Object.defineProperty,dr=Object.getOwnPropertyDescriptor,pr=(r,t,e,s)=>{for(var i=dr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&ur(t,e,i),i};class me extends Q{constructor(t){super(),this._pending=[],this._observer=new U(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}pr([Ps()],me.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,ge=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),Ke=new WeakMap;let Hs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ge&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ke.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ke.set(e,t))}return t}toString(){return this.cssText}};const fr=r=>new Hs(typeof r=="string"?r:r+"",void 0,ye),wt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Hs(e,r,ye)},mr=(r,t)=>{if(ge)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Je=ge?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return fr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gr,defineProperty:yr,getOwnPropertyDescriptor:_r,getOwnPropertyNames:vr,getOwnPropertySymbols:$r,getPrototypeOf:br}=Object,N=globalThis,Ze=N.trustedTypes,Ar=Ze?Ze.emptyScript:"",Gt=N.reactiveElementPolyfillSupport,pt=(r,t)=>r,It={toAttribute(r,t){switch(t){case Boolean:r=r?Ar:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},_e=(r,t)=>!gr(r,t),Qe={attribute:!0,type:String,converter:It,reflect:!1,hasChanged:_e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),N.litPropertyMetadata??(N.litPropertyMetadata=new WeakMap);class Z extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&yr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=_r(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qe}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=br(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,s=[...vr(e),...$r(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Je(i))}else t!==void 0&&e.push(Je(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:It).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:It;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??_e)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[pt("elementProperties")]=new Map,Z[pt("finalized")]=new Map,Gt==null||Gt({ReactiveElement:Z}),(N.reactiveElementVersions??(N.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft=globalThis,Mt=ft.trustedTypes,Xe=Mt?Mt.createPolicy("lit-html",{createHTML:r=>r}):void 0,js="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,zs="?"+T,wr=`<${zs}>`,B=document,yt=()=>B.createComment(""),_t=r=>r===null||typeof r!="object"&&typeof r!="function",ve=Array.isArray,xr=r=>ve(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Kt=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ts=/-->/g,es=/>/g,H=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ss=/'/g,is=/"/g,Ds=/^(?:script|style|textarea|title)$/i,Er=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),A=Er(1),rt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),rs=new WeakMap,z=B.createTreeWalker(B,129);function Fs(r,t){if(!ve(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xe!==void 0?Xe.createHTML(t):t}const Sr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ht;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ht?f[1]==="!--"?o=ts:f[1]!==void 0?o=es:f[2]!==void 0?(Ds.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=H):f[3]!==void 0&&(o=H):o===H?f[0]===">"?(o=i??ht,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?H:f[3]==='"'?is:ss):o===is||o===ss?o=H:o===ts||o===es?o=ht:(o=H,i=void 0);const h=o===H&&r[l+1].startsWith("/>")?" ":"";n+=o===ht?a+wr:u>=0?(s.push(d),a.slice(0,u)+js+a.slice(u)+T+h):a+T+(u===-2?l:h)}return[Fs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class vt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Sr(t,e);if(this.el=vt.createElement(d,s),z.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=z.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(js)){const c=f[o++],h=i.getAttribute(u).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?kr:p[1]==="?"?Cr:p[1]==="@"?Rr:zt}),i.removeAttribute(u)}else u.startsWith(T)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ds.test(i.tagName)){const u=i.textContent.split(T),c=u.length-1;if(c>0){i.textContent=Mt?Mt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],yt()),z.nextNode(),a.push({type:2,index:++n});i.append(u[c],yt())}}}else if(i.nodeType===8)if(i.data===zs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(T,u+1))!==-1;)a.push({type:7,index:n}),u+=T.length-1}n++}}static createElement(t,e){const s=B.createElement("template");return s.innerHTML=t,s}}function nt(r,t,e=r,s){var o,l;if(t===rt)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=_t(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=nt(r,i._$AS(r,t.values),i,s)),t}class Pr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??B).importNode(e,!0);z.currentNode=i;let n=z.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new xt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Or(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=z.nextNode(),o++)}return z.currentNode=B,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class xt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),_t(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=vt.createElement(Fs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Pr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=rs.get(t.strings);return e===void 0&&rs.set(t.strings,e=new vt(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new xt(this.O(yt()),this.O(yt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=nt(this,t,e,0),o=!_t(t)||t!==this._$AH&&t!==rt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=nt(this,l[s+a],e,a),d===rt&&(d=this._$AH[a]),o||(o=!_t(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class kr extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Cr extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Rr extends zt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??$)===rt)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Or{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const Jt=ft.litHtmlPolyfillSupport;Jt==null||Jt(vt,xt),(ft.litHtmlVersions??(ft.litHtmlVersions=[])).push("3.2.1");const Tr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new xt(t.insertBefore(yt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let C=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return rt}};var ns;C._$litElement$=!0,C.finalized=!0,(ns=globalThis.litElementHydrateSupport)==null||ns.call(globalThis,{LitElement:C});const Zt=globalThis.litElementPolyfillSupport;Zt==null||Zt({LitElement:C});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const Nr={};function Ur(r,t,e){switch(r[0]){case"result/select":Ir(r[1],e).then(s=>t(i=>({...i,raceResult:s})));break;case"result/save":Mr(r[1],e).then(s=>t(i=>({...i,result:s}))).then(()=>{const{onSuccess:s}=r[1];s&&s()}).catch(s=>{const{onFailure:i}=r[1];i&&i(s)});break;case"athlete/select":default:console.warn(`Unhandled Auth message: ${r[0]}`)}}function Ir(r,t){return fetch(`/api/races/${r.raceId}`,{headers:R.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Result:",e),e})}function Mr(r,t){return fetch(`/api/races/${r.raceId}/individual-results/${r.athleteId}`,{method:"PUT",headers:{"Content-Type":"application/json",...R.headers(t)},body:JSON.stringify(r.result)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save result for ${r.raceId}`)}).then(e=>{if(e)return e})}const we=class we extends C{render(){return A`
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
        <label @change=${Lr}>
            <input type="checkbox" id="dark-mode-toggle" autocomplete="off">
            Dark Mode
        </label>
        <div class="user-info">
            <span id="userid"></span>
            <button id="signout" disabled>Sign Out</button>
        </div>
      </header>
    `}};we.styles=wt`
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
  `;let ie=we;function Lr(r){const t=r.target;if(t instanceof HTMLInputElement&&t.type==="checkbox"){const e=t.checked;ai.relay(r,"dark-mode",{checked:e})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hr={attribute:!0,type:String,converter:It,reflect:!1,hasChanged:_e},jr=(r=Hr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function b(r){return(t,e)=>typeof e=="object"?jr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $e(r){return b({...r,state:!0,attribute:!1})}var zr=Object.defineProperty,Dr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&zr(t,e,i),i};class be extends C{constructor(){super(...arguments),this.src="/api/races",this.raceIndex=[],this._authObserver=new U(this,"racing:auth"),this._user=new R.User}render(){if(this.raceIndex.length===0)return A`
        <main class="page">
          <header>
            <h2>Most Recent Races</h2>
          </header>
          <p>No race data available.</p>
        </main>
      `;const t=this.raceIndex.map(this.renderItem);return A`
      <main class="page">
        <header>
          <h2>Most Recent Races</h2>
        </header>
        <dl>${t}</dl>
      </main>
    `}hydrate(t){fetch(t,{headers:R.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{Array.isArray(e)?this.raceIndex=e:console.log("Unexpected response format:",e)}).catch(e=>console.log("Failed to load race data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}renderItem(t){return A`
      <dt><a href="/app/races/${t.raceId}" class="race-link">${t.raceName}</a></dt>
    `}}Dr([$e()],be.prototype,"raceIndex");var Fr=Object.defineProperty,Br=Object.getOwnPropertyDescriptor,Bs=(r,t,e,s)=>{for(var i=s>1?void 0:s?Br(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Fr(t,e,i),i};const xe=class xe extends me{get raceData(){return this.model.raceResult}constructor(){super("racing:model")}render(){return this.raceData?A`
      <main class="page">
        ${this.renderRaceName()}
        ${this.renderRaceResults(this.raceData)}
        <a href="../">Back to Meets</a>
      </main>
    `:A`
        <main class="page">
          <p>Loading race data...</p>
        </main>
      `}renderRaceName(){var t;return A`
      <h2>
        <svg class="icon">
          <use href="/icons/running.svg#icon-track2"></use>
        </svg>
        ${(t=this.raceData)==null?void 0:t.raceName} Results
        <svg class="icon">
          <use href="/icons/running.svg#icon-track3"></use>
        </svg>
      </h2>
    `}renderRaceResults(t){return A`
      <section>
        <h2>Individual Results</h2>
        <div class="results-header">
            <span>Position</span>
            <span>Name</span>
            <span>Team</span>
            <span>Time</span>
            <span>School Year</span>
        </div>
        ${t.results.map(e=>A`
            <ind-view
              src="/api/races/${t.raceId}/individual-results/${e.position}" race-id=${t.raceId}
            ></ind-view>
          `)}

        <h2>Team Results</h2>
        <div class="team-results-header">
            <span>Position</span>
            <span>Team</span>
            <span>Points</span>
            <span>Top Runner</span>
            <span>Team Time</span>
            <span>5-Man-Gap</span>
        </div>
        ${t.teamResults.map(e=>A`
            <team-view
              src="/api/races/${t.raceId}/team-results/${e.position}"
            ></team-view>
          `)}
      </section>
    `}connectedCallback(){super.connectedCallback(),this.raceId&&this.dispatchMessage(["result/select",{raceId:this.raceId}])}static get observedAttributes(){return["race-id"]}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="race-id"&&e!==s&&s&&this.dispatchMessage(["result/select",{raceId:s}])}};xe.styles=wt`
    h2 {
        font-family: 'Rubik', Arial, sans-serif;
        color: var(--color-text);
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    svg.icon {
        display: inline;
        height: 2em;
        width: 2em;
        vertical-align: middle;
        fill: currentColor;
    }
    .results-header {
        display: grid;
        grid-template-columns: 100px 1fr 1fr 100px 150px 50px;
        grid-template-rows: 30px;
        gap: 16px;
        align-items: center;
        font-weight: bold;
        text-transform: uppercase;
        background-color: var(--color-accent);
        padding: 8px 0;
        border-bottom: 2px solid #333;
        margin-bottom: 10px;
        border-radius: 10px;
    }
    .results-header span {
        text-align: left;
    }

    .results-header span:first-child {
        padding-left: 12px;
    }

    .team-results-header {
        display: grid;
        grid-template-columns: 100px 1fr 100px 1fr 100px 150px;
        grid-template-rows: 30px;
        gap: 16px;
        align-items: center;
        font-weight: bold;
        text-transform: uppercase;
        background-color: var(--color-accent);
        padding: 8px 0;
        border-bottom: 2px solid #333;
        margin-bottom: 10px;
        border-radius: 10px;
    }
    .team-results-header span {
        text-align: left;
    }

    .team-results-header span:first-child {
        padding-left: 12px;
    }
    
    `;let $t=xe;Bs([b({type:String,attribute:"race-id"})],$t.prototype,"raceId",2);Bs([$e()],$t.prototype,"raceData",1);var qr=Object.defineProperty,q=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&qr(t,e,i),i};const Ee=class Ee extends C{constructor(){super(...arguments),this.src="",this.position=0,this.name="Unknown Athlete",this.team="N/A",this.time="00:00",this.schoolYear="N/A",this._authObserver=new U(this,"racing:auth"),this._user=new R.User}render(){return A`
      <div class="race-result-row">
        <span class="position">${this.position}</span>
        <span class="name">${this.name}</span>
        <span slot="team">${this.team}</span>
        <span>${this.time}</span>
        <span slot="school-year">${this.schoolYear}</span>
        <button id="edit" class="edit-btn @click=${this._navigateToEditView}">Edit</button>
    </div>
  `}hydrate(t){fetch(t,{headers:R.headers(this._user)}).then(e=>{if(e.status!==200)throw new Error(`Status: ${e.status}`);return e.json()}).then(e=>{this.position=e.position,this.name=e.name,this.team=e.team,this.time=e.time,this.schoolYear=e.schoolYear}).catch(e=>console.error(`Failed to render data from ${t}:`,e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)}),this.addEventListener("click",this._navigateToEditView.bind(this))}_navigateToEditView(){console.log(this.raceId,this.position),this.raceId&&this.position!==void 0?(console.log("Navigating to edit view with URL:",`/app/races/${this.raceId}/${this.position}/edit`),Rt.dispatch(this,"history/navigate",{href:`/app/races/${this.raceId}/${this.position}/edit`})):console.error("Missing required parameters: raceId or athleteId.")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="src"&&e!==s&&s&&this.hydrate(s)}};Ee.styles=wt`
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
  `;let P=Ee;q([b({type:String})],P.prototype,"src");q([b({type:Number})],P.prototype,"position");q([b({type:String})],P.prototype,"name");q([b({type:String})],P.prototype,"team");q([b({type:String})],P.prototype,"time");q([b({type:String})],P.prototype,"schoolYear");q([b({type:String,attribute:"race-id"})],P.prototype,"raceId");var Vr=Object.defineProperty,V=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Vr(t,e,i),i};const Se=class Se extends C{constructor(){super(...arguments),this.src="",this.position=0,this.teamName="N/A",this.points=0,this.topRunner="Unknown Runner",this.teamTime="00:00",this.fiveManGap="00:00",this._authObserver=new U(this,"racing:auth"),this._user=new R.User}render(){return A`
        <div class="team-race-result-row">
            <span class="position">${this.position}</span>
            <span class="teamName">${this.teamName}</span>
            <span slot="points">${this.points}</span>
            <span slot="topRunner">${this.topRunner}</span>
            <span slot="teamTime">${this.teamTime}</span>
            <span slot="fiveManGap">${this.fiveManGap}</span>
            <button id="edit" class="edit-btn">Edit</button>
        </div>
      `}hydrate(t){fetch(t,{headers:R.headers(this._user)}).then(e=>{if(e.status!==200)throw new Error(`Status: ${e.status}`);return e.json()}).then(e=>{this.position=e.position,this.teamName=e.teamName,this.points=e.points,this.topRunner=e.topRunner,this.teamTime=e.teamTime,this.fiveManGap=e.fiveManGap}).catch(e=>console.error(`Failed to render data from ${t}:`,e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)}),this.addEventListener("click",()=>this.dispatchEvent(new CustomEvent("edit",{bubbles:!0})))}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="src"&&e!==s&&s&&this.hydrate(s)}};Se.styles=wt`
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
  `;let S=Se;V([b({type:String})],S.prototype,"src");V([b({type:Number})],S.prototype,"position");V([b({type:String})],S.prototype,"teamName");V([b({type:Number})],S.prototype,"points");V([b({type:String})],S.prototype,"topRunner");V([b({type:String})],S.prototype,"teamTime");V([b({type:String})],S.prototype,"fiveManGap");customElements.define("team-view",S);var Yr=Object.defineProperty,Wr=Object.getOwnPropertyDescriptor,Ae=(r,t,e,s)=>{for(var i=s>1?void 0:s?Wr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Yr(t,e,i),i};const Lt=class Lt extends me{get raceResult(){return this.model.raceResult}render(){return A`
      <main class="page">
        <mu-form .init=${this._getFormInitData()} @mu-form:submit=${this._handleSubmit}>
          <input type="number" name="position" .value=${this._getAthletePosition()} @input=${this._handleInput} />
          <input type="text" name="name" .value=${this._getAthleteName()} @input=${this._handleInput} />
          <input type="text" name="team" .value=${this._getAthleteTeam()} @input=${this._handleInput} />
          <input type="text" name="time" .value=${this._getAthleteTime()} @input=${this._handleInput} />
          <input type="text" name="schoolYear" .value=${this._getAthleteSchoolYear()} @input=${this._handleInput} />
        </mu-form>
        <button @click=${this._navigateToRaceResults}>Cancel</button>
      </main>
    `}_handleInput(t){var i;const e=t.target,s=e.value;if(this.selectedAthlete!==void 0&&((i=this.raceResult)!=null&&i.results[this.selectedAthlete])){const n=[...this.raceResult.results];switch(e.name){case"position":n[this.selectedAthlete].position=Number(s);break;case"time":n[this.selectedAthlete].time=s;break;case"team":n[this.selectedAthlete].team=s;break;case"name":n[this.selectedAthlete].name=s;break}this.model.raceResult={...this.raceResult,results:n}}}_getFormInitData(){var t;return this.selectedAthlete!==void 0&&((t=this.raceResult)!=null&&t.results[this.selectedAthlete])?{...this.raceResult.results[this.selectedAthlete],raceId:this.raceId}:{}}_getAthletePosition(){var t;return this.selectedAthlete!==void 0&&((t=this.raceResult)!=null&&t.results[this.selectedAthlete])?this.raceResult.results[this.selectedAthlete].position:""}_getAthleteName(){var t;return this.selectedAthlete!==void 0&&((t=this.raceResult)!=null&&t.results[this.selectedAthlete])?this.raceResult.results[this.selectedAthlete].name:""}_getAthleteTeam(){var t;return this.selectedAthlete!==void 0&&((t=this.raceResult)!=null&&t.results[this.selectedAthlete])?this.raceResult.results[this.selectedAthlete].team:""}_getAthleteTime(){var t;return this.selectedAthlete!==void 0&&((t=this.raceResult)!=null&&t.results[this.selectedAthlete])?this.raceResult.results[this.selectedAthlete].time:""}_getAthleteSchoolYear(){var t;return this.selectedAthlete!==void 0&&((t=this.raceResult)!=null&&t.results[this.selectedAthlete])?this.raceResult.results[this.selectedAthlete].schoolYear:""}_handleSubmit(t){console.log(this.selectedAthlete,this.raceId,t.detail),this.dispatchMessage(["result/save",{raceId:this.raceId||"",athleteId:this.selectedAthlete||0,result:t.detail,onSuccess:()=>Rt.dispatch(this,"history/navigate",{href:`/app/races/${this.raceId}`}),onFailure:e=>console.log("ERROR:",e)}])}_navigateToRaceResults(){Rt.dispatch(this,"history/navigate",{href:`/app/races/${this.raceId}`})}};Lt.uses=fe({"mu-form":ui.Element,"input-array":hr.Element}),Lt.styles=wt`
    .mu-form {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        padding: 16px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .mu-form input[type="number"],
    .mu-form input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .mu-form input[type="number"]:focus,
    .mu-form input[type="text"]:focus {
        border-color: #007BFF;
        outline: none;
    }

    .mu-form input[type="submit"] {
        padding: 8px 16px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .mu-form input[type="submit"]:hover {
        background-color: #0056b3;
    }

    .mu-form input[type="submit"]:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .mu-form .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    @media (max-width: 600px) {
    .mu-form {
        padding: 8px;
    }

    .mu-form input[type="number"],
    .mu-form input[type="text"] {
        padding: 6px;
        font-size: 0.9rem;
    }

    .mu-form input[type="submit"] {
        padding: 6px 12px;
    }
    }
    `;let ot=Lt;Ae([b({type:String,attribute:"race-id"})],ot.prototype,"raceId",2);Ae([b({type:Number,attribute:"athlete-id"})],ot.prototype,"selectedAthlete",2);Ae([$e()],ot.prototype,"raceResult",1);const Pe=class Pe extends C{render(){return A`
      <home-view></home-view>
    `}connectedCallback(){super.connectedCallback()}};Pe.uses=fe({"home-view":be});let re=Pe;const Gr=[{path:"/app/races/:raceId",view:r=>A`
        <race-view race-id=${r.raceId}></race-view>
      `},{path:"/app",view:()=>A`
        <home-view></home-view>
      `},{path:"/app/races/:raceId/:athleteId/edit",view:r=>A`
        <edit-view race-id=${r.raceId} athlete-id=${r.athleteId}></edit-view>
      `},{path:"/",redirect:"/app"}];fe({"mu-auth":R.Provider,"mu-history":Rt.Provider,"mu-switch":class extends or.Element{constructor(){super(Gr,"racing:history","racing:auth")}},"mu-store":class extends yi.Provider{constructor(){super(Ur,Nr,"racing:auth")}},"racing-app":re,"racing-header":ie,"home-view":be,"race-view":$t,"ind-view":P,"team-view":S,"edit-view":ot});
