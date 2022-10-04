import {LOG_NOTHING, LOG_TRACE} from "../logger.js";
import {Appender} from "../appender/stringAppender.js";

const {debug, warn,  error, setActiveLogLevel, reset, getAppenderString} = Appender();

const action = () => {
  debug("action");
  warn("warning");
  error("error");
  console.log(getAppenderString())
};

document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => setActiveLogLevel(LOG_TRACE);
document.getElementById("disable").onclick = () => setActiveLogLevel(LOG_NOTHING);
