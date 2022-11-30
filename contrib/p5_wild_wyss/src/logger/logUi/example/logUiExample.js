import { Appender as ObservableAppender }   from "../../appender/observableAppender.js";
import { Appender as ConsoleAppender }      from "../../appender/consoleAppender.js";
import { LogFactory }         from "../../logFactory.js";
import { createLogUi }        from "../createLogUi.js";
import { addToAppenderList }  from "../../logger.js";

const consoleAppender     = ConsoleAppender();
const observableAppender  = ObservableAppender();

const formatLogMsg = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
};

addToAppenderList(observableAppender, consoleAppender);

const logger1 = LogFactory("ch.fhnw")    (formatLogMsg);
const logger2 = LogFactory("ch.fhnw.ip5")(formatLogMsg);

const container = document.getElementById("container");

createLogUi(container);

setInterval(() => {
  const loggers = [
      logger1.trace, logger1.debug, logger1.info, logger1.warn, logger1.error, logger1.fatal,
      logger2.trace, logger2.info, logger2. debug, logger2.warn, logger2.error, logger2.fatal
  ];
  const msg = ["hello world", "Tobias Wyss", "Andri Wild", "IP5", "wild animals",  "into the wild", "# drive 🏍 "];
  loggers[Math.floor(Math.random() * loggers.length)](msg[Math.floor(Math.random()* msg.length)]);

}, 2000);