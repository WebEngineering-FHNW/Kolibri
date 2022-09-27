import {LOG_NOTHING, LOG_TRACE} from "../logger.js";
import {debug, warn, error, setActiveLogLevel} from "./loggerConfig.js";


const action = () => {
  debug("action");
  warn("warning");
  error("error");
};



document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => setActiveLogLevel(LOG_TRACE);
document.getElementById("disable").onclick = () => setActiveLogLevel(LOG_NOTHING);
