export { createLogUi}

import {Appender} from "../../appender/observableAppender.js";
import {LogUiController} from "../controller.js";
import {LogUiModel} from "../logUiModel.js";
import {LogMessagesContainerView} from "../logView.js";


const createLogUi = rootElement => {

  const logMessagesContainerViewRoot = document.createElement("DIV");


  const appender = Appender();

  const model = LogUiModel(appender);
  const controller = LogUiController(model);

  LogMessagesContainerView(logMessagesContainerViewRoot, controller);

  rootElement.appendChild(logMessagesContainerViewRoot);
};