import {LOG_DEBUG, LOG_NOTHING, LOG_TRACE, setGlobalContext} from "../logger.js";
import {Appender} from "../appender/arrayAppender.js";
import {LogFactory} from "../logFactory.js";
import {lazy } from "../lamdaCalculus.js";


/**
 * Creates a custom log message using the given parameters.
 * @type {MsgFormatType} TODO
 */
const formatLogMsg = logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}] ${date}: ${logMessage}`;
};

let level = LOG_DEBUG;
setGlobalContext("ch.fhnw.logger");
const app = Appender();

const { debug, warn, error } = LogFactory("ch.fhnw.logger")(() => level)(app)(formatLogMsg);

const action = () => {
  debug("action");
  debug(lazy("action"));
  warn("warning");
  error("error");

  console.log("test: " + app.getValue())
};

document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => level = LOG_TRACE;
document.getElementById("disable").onclick = () => level = LOG_NOTHING;








