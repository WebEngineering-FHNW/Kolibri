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
} from "../logger.js";

import { Appender as ArrayAppender }    from "../appender/arrayAppender.js";
import { Appender as ConsoleAppender }  from "../appender/consoleAppender.js";
import { Appender as CountAppender }    from "../appender/countAppender.js";
import { LogFactory }                   from "../logFactory.js";

const LOGGER_CONTEXT          = "ch.fhnw.sample.logger";
const INITIAL_GLOBAL_CONTEXT  = "ch.fhnw";

setGlobalContext(INITIAL_GLOBAL_CONTEXT);

const consoleAppender = ConsoleAppender();
const arrayAppender   = ArrayAppender();
const countAppender   = CountAppender();

const appenderList    = document.getElementsByName("appender");
const levelList       = document.getElementsByName("log-level");
const output          = document.getElementById("log-output");
let delimiter         = document.getElementById("delimiter").value;

const formatLogMsg = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `${context}: [${logLevel}] ${date}: ${logMessage}`;
};

const consoleLogger   = LogFactory(LOGGER_CONTEXT)(consoleAppender)(formatLogMsg);
const arrayLogger     = LogFactory(LOGGER_CONTEXT)(arrayAppender)  (formatLogMsg);
const countLogger     = LogFactory(LOGGER_CONTEXT)(countAppender)  (formatLogMsg);

const logLevels       = [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL, LOG_NOTHING];
const loggers         = [consoleLogger,   arrayLogger,   countLogger];
const appender        = [consoleAppender, arrayAppender, countAppender];

const traceAction     = () => log("trace");
const debugAction     = () => log("debug");
const infoAction      = () => log("info");
const warnAction      = () => log("warn");
const errorAction     = () => log("error");
const fatalAction     = () => log("fatal");

const reset = () => appender.forEach(el => {
    if(el.reset instanceof Function) el.reset();
    document.getElementById("log-output").value = "";
  });

document.getElementById("btn-trace").onclick =  traceAction;
document.getElementById("btn-debug").onclick =  debugAction;
document.getElementById("btn-info") .onclick =  infoAction;
document.getElementById("btn-warn") .onclick =  warnAction;
document.getElementById("btn-error").onclick =  errorAction;
document.getElementById("btn-fatal").onclick =  fatalAction;
document.getElementById("btn-reset").onclick =  reset;

document.getElementById("context-global").addEventListener("input", event =>
    setGlobalContext(event.target.value)
);

document.getElementById("delimiter").addEventListener("input", event =>
    delimiter = event.target.value
);


const log = lvl => {
  updateLevel();
  const [logger, activeAppender] = updateLogger();
  const msg = document.getElementById("log-msg").value;
  logger[lvl](msg);
  if(activeAppender.getValue() !== undefined){
    if(activeAppender.getValue() instanceof Object) {
      output.value = JSON.stringify(activeAppender.getValue());
    } else  {
      output.value = activeAppender.getValue(delimiter.toString());
    }
  }
};

const updateLevel = () =>
  levelList.forEach((el, idx) => {
    if (el.checked) setLoggingLevel(logLevels[idx]);
  });

const updateLogger = () => {
  let currentLogger = loggers[0];
  let currentAppender = appender[0];
  appenderList.forEach((el, idx) => {
    if (el.checked) {
      currentLogger = loggers[idx];
      currentAppender = appender[idx];
    }
  });
  return [currentLogger, currentAppender];
};