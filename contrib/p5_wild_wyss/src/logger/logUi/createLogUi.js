import {contextInputProjector, textFilterProjector, loggingInputProjector } from "./logUiProjector.js";
import {LogUiController} from "./logUiController.js";
import {LogMessagesView, projectLogLevelControls,} from "./logView.js";
import {shadowCss} from "../../../../../docs/src/kolibri/style/kolibriStyle.js";
import {dom} from "../../../../../docs/src/kolibri/util/dom.js"

export { createLogUi }

/**
 * Creates the log ui on a given html element.
 *
 * @param { HTMLElement } rootElement
 */
const createLogUi = rootElement => {

  rootElement.classList.add("container");

  const [configSection, filterSection] = dom(`
    <div class="config controlArea" style="box-shadow: ${shadowCss}"></div>
    <div class="filter controlArea" style="box-shadow: ${shadowCss}"></div>
  `);

  const [loggerLevelFilterRoot, loggerMessageContainerRoot] = dom(`
    <div class="twoColumnItem controls"></div>
    <div class="twoColumnItem messageArea"></div>
  `);

  const controller  = LogUiController();

  configSection.append(...contextInputProjector(controller));
  configSection.append(...loggingInputProjector(controller));
  filterSection.append(...textFilterProjector(controller));

  projectLogLevelControls (loggerLevelFilterRoot, controller);
  LogMessagesView         (loggerMessageContainerRoot,  controller);

  filterSection.append(loggerLevelFilterRoot);

  const styleRoot = document.createElement("STYLE");
  styles(styleRoot);

  rootElement.append(
      styleRoot,
      configSection,
      filterSection,
      loggerMessageContainerRoot
  );
};

const styles = styleElement => {

  styleElement.innerHTML = `
    @import "./logUi.css";
  `
};