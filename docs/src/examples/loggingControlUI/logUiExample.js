import { Appender as ConsoleAppender }              from "../../kolibri/logger/appender/consoleAppender.js";
import { LoggerFactory }                            from "../../kolibri/logger/loggerFactory.js";
import { projectLoggingUi, LOGGING_UI_CSS }         from "../../kolibri/logger/loggingUi/loggingUiProjector.js";
import { LoggingUiController }                      from "../../kolibri/logger/loggingUi/loggingUiController.js";
import { addToAppenderList, setMessageFormatter }   from "../../kolibri/logger/logging.js";
import { dom }                                      from "../../kolibri/util/dom.js";

import  "../../kolibri/logger/loggingSupport.js";// allow changing the logging config through the browser console

// note: this might later be modifiable through the UI
const logMessageFormatter = context => logLevel => logMessage => {
  const date = new Date().toISOString();
  return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
};

// assume we have same logging configuration that we want to control
setMessageFormatter(logMessageFormatter);
addToAppenderList(ConsoleAppender());

// create the UI that allows to control the logging
const controller  = LoggingUiController();
const container   = document.getElementById("loggingUiContainer");
container.append(...projectLoggingUi(controller));

// allow some specific styling of the logging UI
const [styleElement] = dom(`
      <style data-note="Dynamically inserted by logUiExample.js." >
      ${LOGGING_UI_CSS}
       </style>
`);
document.head.append(styleElement);


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
