import { LogFactory }   from "../../logFactory.js";
import { Appender }     from "../../appender/observableAppender.js";
import { createLogUi }  from "../createLogUi.js";

const appender = Appender();

const formatLogMsg = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
};

const logger =  LogFactory(() => [appender])("ch.fhnw")    (formatLogMsg);
const logger2 = LogFactory(() => [appender])("ch.fhnw.ip5")(formatLogMsg);

const container = document.getElementById("container");

createLogUi(container);

setInterval(() => {
  const loggers = [logger.trace, logger.debug, logger.info, logger.warn, logger.error, logger.fatal, logger2.trace, logger2.info, logger2. debug, logger2.warn, logger2.error, logger2.fatal];
  const msg = ["hello world", "Tobias Wyss", "Andri Wild", "IP5", "wild animals",  "into the wild", "#biersaufen 🏍"];
  loggers[Math.floor(Math.random() * loggers.length)](msg[Math.floor(Math.random()* msg.length)]);

}, 2000);