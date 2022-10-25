export { createLogUi}

import { Appender }         from "../../appender/observableAppender.js";
import { LogUiController }  from "../controller.js";
import { LogUiModel }       from "../logUiModel.js";
import {
  LogContextView,
  LogMessagesView,
  FilterView
} from "../logView.js";


const createLogUi = rootElement => {

  const globalContextRoot         = document.createElement("DIV");
  const textFilterRoot            = document.createElement("DIV");
  const logLevelFilterControlRoot = document.createElement("DIV");
  const logMessagesContainerRoot  = document.createElement("DIV");

  const appender    = Appender();
  const model       = LogUiModel(appender);
  const controller  = LogUiController(model);

  LogContextView(globalContextRoot, controller);
  FilterView(textFilterRoot, controller);
  LogMessagesView(logMessagesContainerRoot, controller);

  rootElement.append(
      globalContextRoot,
      textFilterRoot,
      logLevelFilterControlRoot,
      logMessagesContainerRoot
  );
};