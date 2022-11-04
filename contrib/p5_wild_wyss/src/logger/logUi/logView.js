export {
  LogMessagesView,
  projectLogLevelControls,
}

import {
  levelFilterProjector,
  logMessagesProjector,
} from "./logUiProjector.js";

/**
 * The view to select the active log levels.
 *
 * @param { HTMLElement }         rootElement
 * @param { LogUiControllerType } controller
 */
const projectLogLevelControls = (rootElement, controller) => {

  const render = levels => rootElement.replaceChildren(...levelFilterProjector(controller, levels));
  controller.onChangeActiveLogLevel(render);
};

/**
 * The view to show the log messages.
 *
 * @param { HTMLElement }         rootElement
 * @param { LogUiControllerType } controller
 */
const LogMessagesView = (rootElement, controller) => {

  const render = messages =>
      logMessagesProjector(rootElement, controller, messages);

  controller.onMessagesChange(render);
};
