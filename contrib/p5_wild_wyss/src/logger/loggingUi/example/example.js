import {LogFactory} from "../../logFactory.js";
import {LOG_INFO, LOG_TRACE} from "../../logger.js";
import {Appender} from "../../appender/observableAppender.js";
import {createLogUi} from "./loggingUi.js";
import {id} from "../../lamdaCalculus.js";


const appender = Appender();

const formatLogMsg = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `${context}: [${logLevel}] ${date}: ${logMessage}`;
};


const logger = LogFactory("ch.fhnw")(() => LOG_TRACE)(appender)(formatLogMsg);

const container = document.getElementById("container");

createLogUi(container);

setInterval(() => {
  const loggers = [logger.trace, logger.debug, logger.info, logger.warn, logger.error, logger.fatal];
  loggers[Math.floor(Math.random() * loggers.length)]("Tobias");

}, 500);