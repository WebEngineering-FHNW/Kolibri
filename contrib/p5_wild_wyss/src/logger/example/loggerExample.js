import {LOG_NOTHING, LOG_TRACE} from "../logger.js";
import {Appender} from "../appender/consoleAppender.js";

/**
 * Creats a custom log message using the given parameters.
 * @type {MsgFormatter}
 */
const formatLogMsg = logLevel => logMessage => {
  const date = new Date();
  return `[${logLevel}] ${date}: ${logMessage}`;
};

const { debug, warn, error, setActiveLogLevel } = Appender(formatLogMsg);

const action = () => {
  debug("action");
  warn("warning");
  error("error");
};

document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => setActiveLogLevel(LOG_TRACE);
document.getElementById("disable").onclick = () => setActiveLogLevel(LOG_NOTHING);
