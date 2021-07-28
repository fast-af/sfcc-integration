import { attributeNames, Timer } from "./Timer";

describe("<Timer/>", () => {
  customElements.define("fast-timer", Timer);
  const oldError = console.error;

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    console.error = oldError;
    jest.clearAllMocks();
  });

  it("renders a SVG", () => {
    const element = document.createElement("fast-timer");
    document.body.appendChild(element);
    expect(element.shadowRoot?.querySelector("svg")).toBeTruthy();
  });

  it("renders the time", () => {
    const element = document.createElement("fast-timer");
    element.setAttribute(attributeNames.initial_time, "300");
    element.setAttribute(attributeNames.time_remaining, "150");

    document.body.appendChild(element);

    // Checking two times here in the unlikely event that the clock ticks over
    const timeText = element.shadowRoot?.querySelector("text")?.textContent;
    expect(timeText === "2:30" || timeText === "2:29").toBeTruthy();
  });
});
