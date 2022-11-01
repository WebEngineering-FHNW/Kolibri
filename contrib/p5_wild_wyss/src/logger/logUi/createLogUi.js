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

  const styleRoot                 = document.createElement("STYLE");
  const loggerLevelFilterRoot     = document.createElement("DIV");
  const logMessagesContainerRoot  = document.createElement("DIV"); // TODO: loggerMessagesContainerRoot?

  loggerLevelFilterRoot.classList.add ("twoColumnItem");
  loggerLevelFilterRoot.classList.add ("controls");
  logMessagesContainerRoot.classList.add  ("twoColumnItem");
  logMessagesContainerRoot.classList.add  ("messageArea");

  const appender    = Appender();
  const model       = LogUiModel(appender);
  const controller  = LogUiController(model); // TODO: Model in Controller
  // LogUiController(LogUiModel);

  styles(styleRoot);

  rootElement.append(...contextInputProjector(controller));
  rootElement.append(...textFilterProjector(controller));
  projectLogLevelControls (loggerLevelFilterRoot, controller);
  LogMessagesView     (logMessagesContainerRoot,  controller);

  rootElement.append(
      styleRoot,
      loggerLevelFilterRoot,
      logMessagesContainerRoot
  );
};

const styles = styleElement => {

  styleElement.innerHTML = `
    @import "./logUi.css";
  `
};