import {setGlobalContext} from "../logger.js";

export { createLogUi }

import { dom }              from "../../../../../docs/src/kolibri/util/dom.js"
import { shadowCss }        from "../../../../../docs/src/kolibri/style/kolibriStyle.js";
import { LogUiController }  from "./logUiController.js";
import {projectDebounceInput} from "./../../debounceInput/simpleInputProjector.js";
import {SimpleInputController} from "../../../../../docs/src/kolibri/projector/simpleForm/simpleInputController.js";

import {
  LogMessagesView,
  projectLogLevelControls
} from "./logView.js";
import {
  contextInputProjector,
  textFilterProjector,
  loggingSelectProjector
} from "./logUiProjector.js";


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
  projectLogLevelControls (loggerLevelFilterRoot,       controller);
  LogMessagesView         (loggerMessageContainerRoot,  controller);

  const simpleController = SimpleInputController({
    value: "",
    label: "Global Context",
    name: "context",
    type: "text",
  });
  const filterController = SimpleInputController({
    value: "",
    label: "Global Context",
    name: "Filter",
    type: "text",
  });

  simpleController.onValueChanged(value => setGlobalContext(value));
  filterController.onValueChanged(value => controller.setTextFilter(value));

  configSection.append(...projectDebounceInput  ("context", simpleController, 200));
  configSection.append(...loggingSelectProjector (controller));
  filterSection.append(...projectDebounceInput  ("filter", filterController, 200));
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