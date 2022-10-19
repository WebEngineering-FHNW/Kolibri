export { createLogUi}

import {Appender} from "../../appender/observableAppender.js";
import {LogUiController} from "../controller.js";
import {LogUiModel} from "../logUiModel.js";
import {LogLevelFilterControlView, LogMessagesContainerView} from "../logView.js";


const createLogUi = rootElement => {

  const logLevelFilterControlView = document.createElement("DIV");
  const logMessagesContainerViewRoot = document.createElement("DIV");

  const appender = Appender();

  const model = LogUiModel(appender);
  const controller = LogUiController(model);

  LogLevelFilterControlView(logMessagesContainerViewRoot, controller);
  LogMessagesContainerView(logMessagesContainerViewRoot, controller);

  rootElement.appendChild(logLevelFilterControlView);
  rootElement.appendChild(logMessagesContainerViewRoot);
};