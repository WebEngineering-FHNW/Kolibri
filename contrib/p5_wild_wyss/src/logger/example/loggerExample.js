import {LOG_DEBUG, LOG_INFO, LOG_NOTHING, LOG_TRACE, setGlobalContext} from "../logger.js";
import {Appender} from "../appender/consoleAppender.js";
import {LogFactory} from "../logFactory.js";


/**
 * Creates a custom log message using the given parameters.
 * @type {MsgFormatter} TODO
 */
const formatLogMsg = logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}] ${date}: ${logMessage}`;
};

let level = LOG_DEBUG;
setGlobalContext("ch.fhnw.logger");



const { debug, warn, error } = LogFactory("ch.fhnw.logger")(() => level)(Appender())(_ => id);

const action = () => {
  debug("action");
  debug(lazy("action"));
  warn("warning");
  error("error");

};

document.getElementById("action").onclick = action;
document.getElementById("trace").onclick = () => level = LOG_TRACE;
document.getElementById("disable").onclick = () => level = LOG_NOTHING;








