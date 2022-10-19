import {LogUiModel}                 from "./logUiModel.js";
import {LogUiController}            from "./controller.js";
import {Appender as LogUiAppender}  from "../appender/observableAppender.js";
import {
  LogMessagesContainerView,
  LogLevelFilterControlView,
  LogContextView,
  LogMessageSearchView,
}   from "./logView.js";

const appender    = LogUiAppender();
const model       = LogUiModel(appender);
const controller  = LogUiController(model);

LogContextView          (document.getElementById("globalContext"),      controller);
LogMessageSearchView    (document.getElementById("searchBar"),          controller);
LogLevelFilterControlView     (document.getElementById("logLevelButtons"),    controller);
LogMessagesContainerView (document.getElementById("logMessageContainer"),controller);










// controller.setActiveLogLevel({...controller.getActiveLogLevel(), debug: true});
// controller.setActiveLogLevel({...controller.getActiveLogLevel(), warn: true});
// controller.setActiveLogLevel({...controller.getActiveLogLevel(), info: true});
//
// setTimeout(() => {
//   controller.setActiveLogLevel({...controller.getActiveLogLevel(), warn: false});
// }, 1000);
//
// setTimeout(() => {
//   controller.setActiveLogLevel({...controller.getActiveLogLevel(), trace: true});
// }, 2000);
