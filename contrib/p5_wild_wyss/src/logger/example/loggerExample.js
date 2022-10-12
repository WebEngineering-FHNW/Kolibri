import {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_FATAL,
  LOG_INFO,
  LOG_NOTHING,
  LOG_TRACE,
  LOG_WARN,
  setGlobalContext
} from "../logger.js";

import {Appender as ArrayAppender} from "../appender/arrayAppender.js";
import {Appender as StringAppender} from "../appender/stringAppender.js";
import {Appender as ConsoleAppender} from "../appender/consoleAppender.js";
import {Appender as CountAppender} from "../appender/countAppender.js";
import {LogFactory} from "../logFactory.js";

const logLevels = [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL, LOG_NOTHING];

const consoleAppender = ConsoleAppender();
const stringAppender  = StringAppender();
const arrayAppender   = ArrayAppender();
const countAppender   = CountAppender();

/**
 * Creates a custom log message using the given parameters.
 * @type {MsgFormatter} TODO
 */
const formatLogMsg = logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}] ${date}: ${logMessage}`;
};

setGlobalContext("ch.fhnw");
let delimiter = document.getElementById("delimiter").value;

const consoleLogger = LogFactory("ch.fhnw.sample.logger")(() => currentLogLevel)(consoleAppender)(formatLogMsg);
const stringLogger  = LogFactory("ch.fhnw.sample.logger")(() => currentLogLevel)(stringAppender) (formatLogMsg);
const arrayLogger   = LogFactory("ch.fhnw.sample.logger")(() => currentLogLevel)(arrayAppender)  (formatLogMsg);
const countLogger   = LogFactory("ch.fhnw.sample.logger")(() => currentLogLevel)(countAppender)  (formatLogMsg);

const loggers = [consoleLogger, stringLogger, arrayLogger, countLogger];
const appender = [consoleAppender, stringAppender, arrayAppender, countAppender];

const log = lvl => {
  updateLevel();
  const [logger, activeAppender] = updateLogger();
  const msg = document.getElementById("log-msg").value;
  logger[lvl](msg);
  if(activeAppender.getValue instanceof Function){
    if(activeAppender.getValue() instanceof Object) {
      document.getElementById("log-output").value = JSON.stringify(activeAppender.getValue());
    } else  {
      document.getElementById("log-output").value = activeAppender.getValue(delimiter.toString());
    }
  }
};

const traceAction = () => log("trace");
const debugAction = () => log("debug");
const infoAction  = () => log("info");
const warnAction  = () => log("warn");
const errorAction = () => log("error");
const fatalAction = () => log("fatal");
const reset = () => appender.forEach(el => {
    if(el.reset instanceof Function) el.reset();
    document.getElementById("log-output").value = "";
  });

document.getElementById("btn-trace").onclick =  traceAction;
document.getElementById("btn-debug").onclick =  debugAction;
document.getElementById("btn-info").onclick  =  infoAction;
document.getElementById("btn-warn").onclick  =  warnAction;
document.getElementById("btn-error").onclick =  errorAction;
document.getElementById("btn-fatal").onclick =  fatalAction;
document.getElementById("btn-reset").onclick =  reset;

let currentLogLevel = LOG_DEBUG;

const updateLevel = () => {
  const levelList = document.getElementsByName("log-level");
  levelList.forEach((el, idx) => {
    if (el.checked) {
      currentLogLevel = logLevels[idx];
    }
  });
};

const updateLogger = () => {
  let currentLogger = loggers[0];
  let currentAppender = appender[0];
  const appenderList = document.getElementsByName("appender");
  appenderList.forEach((el, idx) => {
    if (el.checked) {
      currentLogger = loggers[idx];
      currentAppender = appender[idx];
      // console.log("set current appender to: " + idx)
    }
  });
  return [currentLogger, currentAppender];
};

document.getElementById("context-global").addEventListener("input", event =>
  setGlobalContext(event.target.value)
);
document.getElementById("delimiter").addEventListener("input", event => {
  delimiter = event.target.value;
});


