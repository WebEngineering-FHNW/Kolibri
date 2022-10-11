import {LOG_NOTHING, LOG_TRACE} from "../logger.js";
import {Appender} from "../appender/consoleAppender.js";
/**
 * Creates a custom log message using the given parameters.
 * @type {MsgFormatter} TODO
 */
const formatLogMsg = logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}] ${date}: ${logMessage}`;
};

const { trace, debug, warn, error, setActiveLogLevel, getAppenderValue } = Appender(formatLogMsg);

const c = x => () => x;

const action = () => {
  debug("action");
  debug(c("action"));
  warn("warning");
  error("error");
  console.count("Tobias");
  console.count("Wyss");
  console.log(getAppenderValue());
};

document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => setActiveLogLevel(LOG_TRACE);
document.getElementById("disable").onclick = () => setActiveLogLevel(LOG_NOTHING);
