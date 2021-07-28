export const buttonTemplate = document.createElement("template");
buttonTemplate.innerHTML = `
<style>
:host {
  display: block;
  width: 100%;
  height: 50px;
}

:host button {
  width: 100%;
  height: 50px;
  border-radius: 6px;
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  background-color: black; 
  color: white;
  cursor: pointer;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  border: 1px solid #000;
  outline-color: transparent;
}

:host button:focus {
  border-color: transparent;
  outline-color: #000;
}

:host button img {
  margin-right: 10px;
}
</style>
<button>
<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxMyAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4wODc0IDYuMTM1NzNIMTEuNDY5N0MxMS44OTE5IDYuMTUxNCAxMi4yODk5IDYuMzE1NjkgMTIuNTc2NSA2LjU5MjYxQzEyLjg2MzIgNi44Njk1MyAxMy4wMTUgNy4yMzY0OCAxMi45OTg4IDcuNjEzMDdWMTMuNTIyNkMxMy4wMTUgMTMuODk5MiAxMi44NjMyIDE0LjI2NjIgMTIuNTc2NiAxNC41NDMxQzEyLjI4OTkgMTQuODIgMTEuODkxOSAxNC45ODQzIDExLjQ2OTcgMTVIMS41MzAzMUMxLjEwODEgMTQuOTg0MyAwLjcxMDA3NiAxNC44MiAwLjQyMzQ1MSAxNC41NDMxQzAuMTM2ODI2IDE0LjI2NjIgLTAuMDE1MDI0MiAxMy44OTkyIDAuMDAxMTc0ODkgMTMuNTIyNlY3LjYxMzA3Qy0wLjAxNTAxMzggNy4yMzY0OSAwLjEzNjg0MSA2Ljg2OTUzIDAuNDIzNDY1IDYuNTkyNjJDMC43MTAwODkgNi4zMTU3IDEuMTA4MTEgNi4xNTE0MSAxLjUzMDMxIDYuMTM1NzNIMS45MTI1OVYzLjc0NzU1QzEuOTEyNTkgMi4zNzMzOCAyLjIzNjA4IDEuNTcyNzcgMi45NTU4MSAwLjkzMDc1MUMzLjY3NTUzIDAuMjg4NzM3IDQuNTcyNjQgMCA2LjExMjgyIDBINi44ODcxQzguNDI3MjggMCA5LjMyNDUgMC4yODg3MDMgMTAuMDQ0MiAwLjkzMDc1MUMxMC43NjM5IDEuNTcyOCAxMS4wODc0IDIuMzczMzggMTEuMDg3NCAzLjc0NzU1VjYuMTM1NzNaTTkuNTU4MjcgMy43NDgxM0M5LjU1ODI3IDIuODczNjcgOS4zNTIzMyAyLjM2NDIxIDguODk0NCAxLjk1NTY0QzguNDM2NDYgMS41NDcwNiA3Ljg2NTUyIDEuMzYzMzYgNi44ODUzNCAxLjM2MzM2SDYuMTE0ODFDNS4xMzQ2NyAxLjM2MzM2IDQuNTYzNjkgMS41NDcwNiA0LjEwNTc5IDEuOTU1NjRDMy42NDc5IDIuMzY0MjEgMy40NDE3MyAyLjg3MzY3IDMuNDQxNzMgMy43NDgxM1Y2LjEzNTczSDkuNTU4MjdWMy43NDgxM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" alt="Secured Fast Checkout">
<span>Fast Login</span>
</button>
`;
