import { InputProjector}        from "../../projector/simpleForm/simpleInputProjector.js";
import { dom }                  from "../../util/dom.js";
import { shadowCss }            from "../../../customize/kolibriStyle.js";
import { projectLoggingChoice } from "./loggingLevelProjector.js";

export { projectLoggingUi, LOGGING_UI_CSS }

const {projectDebounceInput, projectInstantInput} = InputProjector;

/**
 * Creates the log ui as a div and binds the level, context, and message controllers.
 * @param { LoggingUiControllerType }   logUiController
 * @return { Array<HTMLDivElement> }
 * @impure adds the style element to the document head
 */
const projectLoggingUi = logUiController => {

  const [configSection] = /** @type { Array<HTMLDivElement> } */ dom(`
    <div class="logging-ui-config"></div>
  `);

  configSection.append(...projectDebounceInput(200)(logUiController.loggingContextController, "context"));
  configSection.append(...projectLoggingChoice(     logUiController.loggingLevelController));
  configSection.append(...projectInstantInput(      logUiController.lastLogMessageController, "lastLogMessage"));

  return [configSection];
};

const LOGGING_UI_CSS = `
  .logging-ui-config {
      padding:                2rem;
      display:                grid;
      grid-template-columns:  auto 1fr;
      grid-gap:               1em 2em;
      box-shadow:             ${shadowCss},
  }
  .logging-ui-config input {
      width: 100%;
  }
`;



