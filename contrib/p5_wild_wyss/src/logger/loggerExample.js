import {Logger} from "./logger.js";

let state = true;

const action = () => {
  log("action")(state);
}

const onOff = () => {
  state = !state;
}

const log = Logger(msg => console.log(msg));

document.getElementById("action").onclick = action;
document.getElementById("onOff").onclick = onOff;
