import {projectDebounceInput}                     from "../../projector/simpleForm/simpleInputProjector.js";
import {SimpleInputController}                    from "../../projector/simpleForm/simpleInputController.js";
import {dom}                                      from "../../util/dom.js";
import {shadowCss}                                from "../../style/kolibriStyle.js";
import {setLoggingContext}                        from "../logger.js";
import {LogUiController}                          from "./logUiController.js";
import {loggingSelectProjector}                   from "./logUiProjector.js";
import {LogMessagesView, projectLogLevelControls} from "./logView.js";

export { createLogUi }

/**
 * Creates the log ui under a given html element.
 *
 * @param { HTMLElement } rootElement
 * @param { String }      cssStyleUrl - url to the css file that is used for styling the log ui
 */
const createLogUi = (rootElement, cssStyleUrl) => {

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
    value:  "",
    label:  "Logging Context",
    name:   "context",
    type:   "text",
  });
  const filterController = SimpleInputController({
    value:  "",
    label:  "Filter",
    name:   "Filter",
    type:   "text",
  });

  simpleController.onValueChanged(value => setLoggingContext(value));
  filterController.onValueChanged(value => controller.setTextFilter(value));

  configSection.append(...projectDebounceInput  ("context", simpleController, 200));
  configSection.append(...loggingSelectProjector(controller));
  filterSection.append(...projectDebounceInput  ("filter",  filterController, 200));
  filterSection.append(loggerLevelFilterRoot);

  const [styleElement] = dom(`
        <link rel="stylesheet" type="text/css"  href="${cssStyleUrl}"
              data-note="Dynamically inserted by createLogUi.js." 
        />
  `);
  document.head.append(styleElement);

  rootElement.append(
      configSection,
      filterSection,
      loggerMessageContainerRoot
  );
};



