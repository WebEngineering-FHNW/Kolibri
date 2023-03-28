import { InputProjector}        from "../../projector/simpleForm/simpleInputProjector.js";
import { dom }                  from "../../util/dom.js";
import { shadowCss }            from "../../style/kolibriStyle.js";
import { projectLoggingChoice } from "./logUiProjector.js";

export { logUiView }

const {projectDebounceInput, projectInstantInput} = InputProjector;

/**
 * Creates the log ui under a given html element.
 * @param { LogUiControllerType } logUiController
 * @param { HTMLElement } rootElement
 * @param { String }      cssStyleUrl - url to the css file that is used for styling the log ui
 */
const logUiView = (logUiController, rootElement, cssStyleUrl) => {

  rootElement.classList.add("container"); // todo dk: be more specific to avoid conflicts with other css

  const [configSection] = dom(`
    <div class="config controlArea" style="box-shadow: ${shadowCss}"></div>
  `);

  configSection.append(...projectDebounceInput(200)(logUiController.loggingContextController, "context"));
  configSection.append(...projectLoggingChoice(logUiController.loggingLevelController));
  configSection.append(...projectInstantInput(logUiController.lastLogMessageController, "lastLogMessage"));

  const [styleElement] = dom(`
        <link rel="stylesheet" type="text/css"  href="${cssStyleUrl}"
              data-note="Dynamically inserted by createLogUi.js." 
        />
  `);
  document.head.append(styleElement);

  rootElement.append(configSection);
};



