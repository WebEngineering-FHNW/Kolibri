import {LogUiModel}                 from "./logUiModel.js";
import {Appender as LogUiAppender}  from "../appender/observableAppender.js";

const appender = LogUiAppender();
const model = LogUiModel(appender);
const controller = LogUiController(model);

LoggerView(document.getElementById("logger-ui"), controller);