import {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_FATAL,
  LOG_INFO,
  LOG_NOTHING,
  LOG_TRACE,
  LOG_WARN,
  setGlobalContext,
  setLoggingLevel,
  addToAppenderList,
  removeFromAppenderList,
  getAppenderList
} from "../logger.js";

import { Appender as ArrayAppender }    from "../appender/arrayAppender.js";
import { Appender as ConsoleAppender }  from "../appender/consoleAppender.js";
import { Appender as CountAppender }    from "../appender/countAppender.js";
import { LogFactory }                   from "../logFactory.js";

const LOGGER_CONTEXT          = "ch.fhnw.sample.logger";
const INITIAL_GLOBAL_CONTEXT  = "ch.fhnw";

setGlobalContext(INITIAL_GLOBAL_CONTEXT);
setLoggingLevel(LOG_DEBUG);

const consoleAppender = ConsoleAppender();
const arrayAppender   = ArrayAppender();
const countAppender   = CountAppender();

const appenderList    = document.getElementsByName("appender");
const levelList       = document.getElementsByName("log-level");
const output          = document.getElementById   ("log-output");

const formatLogMsg = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `${context}: [${logLevel}] ${date}: ${logMessage}`;
};

const logger          = LogFactory(LOGGER_CONTEXT)(formatLogMsg);
const logLevels       = [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL, LOG_NOTHING];
const appender        = [consoleAppender, arrayAppender, countAppender];


const reset = () => appender.forEach(el => {
    if(el.reset instanceof Function) el.reset();
    document.getElementById("log-output").value = "";
  });

document.getElementById("btn-trace").onclick = () => log("trace");
document.getElementById("btn-debug").onclick = () => log("debug");
document.getElementById("btn-info") .onclick = () => log("info");
document.getElementById("btn-warn") .onclick = () => log("warn");
document.getElementById("btn-error").onclick = () => log("error");
document.getElementById("btn-fatal").onclick = () => log("fatal");
document.getElementById("btn-reset").onclick = reset;

document.getElementById("context-global").addEventListener("input", event =>
    setGlobalContext(event.target.value)
);

const log = lvl => {
  updateLevel();
  const activeAppender  = updateLogger();
  const msg = document.getElementById("log-msg").value;
  logger[lvl](msg);
  if (activeAppender[0].getValue() !== undefined){
    output.value = JSON.stringify(activeAppender[0].getValue());
  }
};

const updateLevel = () =>
  levelList.forEach((el, idx) => {
    if (el.checked) setLoggingLevel(logLevels[idx]);
  });

const updateLogger = () => {
  const currentAppender = getAppenderList();
  currentAppender.forEach(appender => removeFromAppenderList(appender));
  appenderList.forEach((el, idx) => {
    if (el.checked) {
      addToAppenderList(appender[idx]);
    }
  });
  return getAppenderList();
};