import {LOG_NOTHING, LOG_TRACE} from "../logger.js";
import {Appender} from "../appender/consoleAppender.js";

const {debug, warn,  error, setActiveLogLevel, reset, getAppenderValue} = Appender();

const action = () => {
  console.log(debug("action"));
  warn("warning");
  error("error");
};

document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => setActiveLogLevel(LOG_TRACE);
document.getElementById("disable").onclick = () => setActiveLogLevel(LOG_NOTHING);
