import {Appender as ConsoleAppender}            from "../../kolibri/logger/appender/consoleAppender.js";
import {LoggerFactory}                          from "../../kolibri/logger/loggerFactory.js";
import {logUiView}                              from "../../kolibri/logger/logUi/logUiView.js";
import {addToAppenderList, setMessageFormatter} from "../../kolibri/logger/logger.js";
import {LogUiController}                        from "../../kolibri/logger/logUi/logUiController.js";

// note: this might later be modifiable through the UI
const formatLogMsg = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
};

// assume we have same logging configuration that we want to control
setMessageFormatter(formatLogMsg);
addToAppenderList(ConsoleAppender());

// create the UI that allows to control the logging
const controller  = LogUiController();
const container   = document.getElementById("container");
logUiView(controller, container, "../../../css/kolibri-logging-control.css");

// create some random log messages on different loggers with different log levels and messages, just for demo purposes
const logger1 = LoggerFactory("ch.fhnw");
const logger2 = LoggerFactory("ch.fhnw.ip5");
setInterval(() => {
  const loggers = [
      logger1.trace, logger1.debug, logger1.info, logger1.warn, logger1.error, logger1.fatal,
      logger2.trace, logger2.info, logger2. debug, logger2.warn, logger2.error, logger2.fatal
  ];
  const msg = ["hello world", "Tobias Wyss", "Andri Wild", "IP5", "wild animals",  "into the wild", "# drive 🏍 "];
  loggers[Math.floor(Math.random() * loggers.length)](msg[Math.floor(Math.random()* msg.length)]);

}, 2000);
