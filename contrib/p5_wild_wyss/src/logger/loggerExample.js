import {Logger, enableLogger, disableLogger} from "./logger.js";

const action = () => {
  log("action");

}

const log = Logger(msg => console.error(msg))(_ => 0);

document.getElementById("action").onclick = action;
