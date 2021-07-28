export const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    }

    :host button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }

    .container {
      display: flex;
      align-items: center;
    }

    #message {
      font-weight: normal;
      font-size: 14px;
      color: #808080;
    }
  </style>
  <div id="container">
    <span id="message">Loading...</span>
  </div>
`;
