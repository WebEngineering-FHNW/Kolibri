import {LOG_NOTHING, LOG_TRACE} from "../logger.js";
import {Appender} from "../appender/countAppender.js";

/**
 * Creates a custom log message using the given parameters.
 * @type {MsgFormatter}
 */
const formatLogMsg = logLevel => logMessage => {
  const date = new Date();
  return `[${logLevel}] ${date}: ${logMessage}`;
};

const { trace, debug, warn, error, setActiveLogLevel, getAppenderValue } = Appender(formatLogMsg);

const action = () => {
  debug("action");
  // warn("warning");
  // error("error");
  console.log(getAppenderValue())
};

document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => setActiveLogLevel(LOG_TRACE);
document.getElementById("disable").onclick = () => setActiveLogLevel(LOG_NOTHING);
