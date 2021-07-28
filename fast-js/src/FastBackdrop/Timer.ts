const tmpl = document.createElement("template");
tmpl.innerHTML = `
  <style>
    :host {
      display: block;
    }

    :host text.small {
        stroke: #FFFFFF;
        fill: #FFFFFF;
        font-size: 21px;
        text-anchor: middle;
        alignment-baseline: middle;
    }

    :host svg {
      height: 80px;
      width: 80px;
    }


  </style>
  <div class="backdrop">
    <svg viewBox="-40 -40 80 80">
    <circle
            cx="0"
            cy="0"
            r="40"
            fill="#24B560"
        >
        </circle>
        <circle
            cx="0"
            cy="0"
            r="20"
            stroke-width="40"
            stroke="#1DA054"
            fill="transparent"
            class="wedge"
        />
        <text x="0" y="0" class="small"></text>

    </svg>

  </div>
`;

export const attributeNames = {
  time_remaining: "time_remaining",
  initial_time: "initial_time",
  radius: "radius",
};

const RADIUS = 40;

/**
 * Component that shows a countdown timer shown as a Camembert.
 *
 * It takes an initial_time and a time_remaining attribute to show a wedge with the time remaining
 * as a proportion of the whole.
 */
export const Timer = class extends HTMLElement {
  startTime: number;
  interval: number | undefined;

  static get observedAttributes() {
    return [attributeNames.time_remaining, attributeNames.initial_time];
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(tmpl.content.cloneNode(true));

    this.startTime = Number(new Date());
  }

  get time_remaining() {
    return this.getAttribute(attributeNames.time_remaining) ?? "";
  }

  set time_remaining(val) {
    this.setAttribute(attributeNames.time_remaining, val);
  }

  get initial_time() {
    return this.getAttribute(attributeNames.initial_time) ?? "";
  }

  set initial_time(val) {
    this.setAttribute(attributeNames.initial_time, val);
  }

  get radius() {
    return this.getAttribute(attributeNames.radius) ?? RADIUS.toString();
  }

  set radius(val) {
    this.setAttribute(attributeNames.radius, val);
  }

  // When the attributes are changed, set the interval to redraw every second
  attributeChangedCallback() {
    this.startTime = Number(new Date());
    clearInterval(this.interval);
    this.redraw();
    this.interval = window.setInterval(() => {
      this.redraw();
    }, 1000);
  }

  redraw() {
    const secondsRemaining =
      Number(this.time_remaining) -
      (Number(new Date()) - this.startTime) / 1000;

    if (secondsRemaining >= 0) {
      // Use a stroke-dasharray to draw the wedge
      const wedge = this.shadowRoot?.querySelector(
        ".wedge"
      ) as SVGCircleElement;
      wedge.style.setProperty(
        "stroke-dasharray",
        Math.floor(
          (Math.PI * Number(this.radius) * secondsRemaining) /
            parseInt(this.initial_time)
        ) + " 1000"
      ); // arbitrary big number for remainder of stroke

      // Show the time remaining in m:ss
      const text = this.shadowRoot?.querySelector("text");
      if (!text) return;
      const seconds = Math.floor(secondsRemaining % 60);
      text.textContent =
        Math.floor(secondsRemaining / 60) +
        ":" +
        (seconds < 10 ? "0" : "") +
        seconds;
    }
  }
};
