import {Logger} from "./logger.js";

let state = false;

const loggerActivated = () => state;


const action = () => {
  log("action");
};

const onOff = () => {
  state = !state;
};

const log = Logger(loggerActivated)(msg => console.log(msg));

document.getElementById("action").onclick = action;
document.getElementById("onOff").onclick = onOff;
