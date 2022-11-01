import {contextInputProjector, textFilterProjector} from "./logUiProjector.js";
import {Appender} from "../appender/observableAppender.js";
import {LogUiController} from "./logUiController.js";
import {LogUiModel} from "./logUiModel.js";
import {projectLogLevelControls, LogMessagesView,} from "./logView.js";

export { createLogUi}

/**
 * Creates the log ui on a given html element.
 *
 * @param { HTMLElement } rootElement
 */
const createLogUi = rootElement => {

  const styleRoot                   = document.createElement("STYLE");
  const loggerLevelFilterRoot       = document.createElement("DIV");
  const loggerMessageContainerRoot  = document.createElement("DIV");

  loggerLevelFilterRoot     .classList.add("twoColumnItem");
  loggerLevelFilterRoot     .classList.add("controls");
  loggerMessageContainerRoot.classList.add("twoColumnItem");
  loggerMessageContainerRoot.classList.add("messageArea");

  const controller  = LogUiController();
  // LogUiController(LogUiModel);

  styles(styleRoot);

  rootElement.append(...contextInputProjector(controller));
  rootElement.append(...textFilterProjector(controller));
  projectLogLevelControls (loggerLevelFilterRoot, controller);
  LogMessagesView     (loggerMessageContainerRoot,  controller);

  rootElement.append(
      styleRoot,
      loggerLevelFilterRoot,
      loggerMessageContainerRoot
  );
};

const styles = styleElement => {

  styleElement.innerHTML = `
    @import "./logUi.css";
  `
};