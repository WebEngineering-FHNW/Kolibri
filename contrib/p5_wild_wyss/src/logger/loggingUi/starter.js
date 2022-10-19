import {LogUiModel}                 from "./logUiModel.js";
import {LogUiController}            from "./controller.js";
import {Appender as LogUiAppender}  from "../appender/observableAppender.js";
import {
  LoggerView,
  LogLevelControlView,
  LogContextView
}   from "./logView.js";

const appender    = LogUiAppender();
const model       = LogUiModel(appender);
const controller  = LogUiController(model);

LogContextView(document.getElementById("globalContext"), controller);
LogLevelControlView(document.getElementById("loglevel-buttons"), controller);
LoggerView(document.getElementById("logger-ui"), controller);

controller.setActiveLogLevel({...controller.getActiveLogLevel(), debug: true});
controller.setActiveLogLevel({...controller.getActiveLogLevel(), warn: true});
controller.setActiveLogLevel({...controller.getActiveLogLevel(), info: true});

setTimeout(() => {
  controller.setActiveLogLevel({...controller.getActiveLogLevel(), warn: false});
}, 1000);
