export { createLogUi}

import { Appender }         from "../appender/observableAppender.js";
import { LogUiController }  from "./logUiController.js";
import { LogUiModel }       from "./logUiModel.js";
import {
  LogContextView,
  LogMessagesView,
  TextFilterView,
  LogLevelControlView,
} from "./logView.js";

/**
 * Creates the log ui on a given html element.
 *
 * @param { HTMLElement } rootElement
 */
const createLogUi = rootElement => {

  const style                     = document.createElement("STYLE");
  const logLevelFilterControlRoot = document.createElement("DIV");
  const logMessagesContainerRoot  = document.createElement("DIV");

  rootElement.classList.add("hasBorder");

  logLevelFilterControlRoot.classList.add ("twoColumnItem");
  logLevelFilterControlRoot.classList.add ("controls");
  logMessagesContainerRoot.classList.add  ("twoColumnItem");
  logMessagesContainerRoot.classList.add  ("messageArea");


  const appender    = Appender();
  const model       = LogUiModel(appender);
  const controller  = LogUiController(model);

  Styles(style);

  LogContextView(rootElement, controller);
  TextFilterView(rootElement, controller);
  LogLevelControlView (logLevelFilterControlRoot, controller);
  LogMessagesView     (logMessagesContainerRoot,  controller);

  rootElement.append(
      style,
      logLevelFilterControlRoot,
      logMessagesContainerRoot
  );
};

const Styles = style => {

  style.innerHTML = `
    @import "./logUi.css";
  `

};