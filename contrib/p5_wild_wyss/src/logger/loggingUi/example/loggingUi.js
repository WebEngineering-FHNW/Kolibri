export { createLogUi}

import {Appender} from "../../appender/observableAppender.js";
import {LogUiController} from "../controller.js";
import {LogUiModel} from "../logUiModel.js";
import {LogLevelFilterControlView, LogMessagesContainerView, TextFilterView} from "../logView.js";


const createLogUi = rootElement => {

  const textFilterRoot            = document.createElement("DIV");
  const logLevelFilterControlRoot = document.createElement("DIV");
  const logMessagesContainerRoot  = document.createElement("DIV");

  const appender = Appender();

  const model = LogUiModel(appender);
  const controller = LogUiController(model);

  TextFilterView(textFilterRoot, controller);
  LogLevelFilterControlView(logLevelFilterControlRoot, controller);
  LogMessagesContainerView(logMessagesContainerRoot, controller);

  rootElement.appendChild(textFilterRoot);
  rootElement.appendChild(logLevelFilterControlRoot);
  rootElement.appendChild(logMessagesContainerRoot);
};