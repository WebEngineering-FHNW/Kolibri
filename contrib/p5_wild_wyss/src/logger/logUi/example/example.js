import { LogFactory }   from "../../logFactory.js";
import { LOG_TRACE }    from "../../logger.js";
import { Appender }     from "../../appender/observableAppender.js";
import { createLogUi }  from "./loggingUi.js";

const appender = Appender();

const formatLogMsg = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `${context}: [${logLevel}] ${date}: ${logMessage}`;
};

const logger =  LogFactory("ch.fhnw")     (() => LOG_TRACE)(appender)(formatLogMsg);
const logger2 = LogFactory("ch.fhnw.ip5") (() => LOG_TRACE)(appender)(formatLogMsg);

const container = document.getElementById("container");

createLogUi(container);

setInterval(() => {
  const loggers = [logger.trace, logger.debug, logger.info, logger.warn, logger.error, logger.fatal, logger2.trace, logger2.info, logger2. debug, logger2.warn, logger2.error, logger2.fatal];
  const msg = ["hello world", "Tobias", "Andri", "IP5", "#biersaufen 🏍"];
  loggers[Math.floor(Math.random() * loggers.length)](msg[Math.floor(Math.random()* msg.length)]);

}, 500);