import {DebugLogger, LOG_NOTHING, LOG_TRACE} from "./logger.js";

let state = LOG_NOTHING;

const activated = () => state;

const action = () => {
  debug("action");
};

const onOff = () => {
  state = LOG_TRACE;
};

const debug = DebugLogger(activated)(msg => {
  console.log(msg)
});

document.getElementById("action").onclick = action;
document.getElementById("onOff").onclick = onOff;
