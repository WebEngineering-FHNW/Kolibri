export {
  LogMessagesView,
  LogContextView,
  TextFilterView,
  LogLevelControlView,
}

import {
  contextInputProjector,
  levelFilterProjector,
  logMessagesProjector,
  textFilterProjector,
} from "./logUiProjector.js";


/**
 * The view to manipulate the global logger context.
 *
 * @param { HTMLElement }     rootElement
 * @param { LogUiControllerType } controller
 * @constructor
 */
const LogContextView = (rootElement, controller) => {
  const [label, input] = contextInputProjector(controller);
  rootElement.append(label, input);
};

/**
 * The view to enter a text for filtering log messages.
 *
 * @param { HTMLElement }     rootElement
 * @param { LogUiControllerType } controller
 * @constructor
 */
const TextFilterView = (rootElement, controller) => {
  const [label, input] = textFilterProjector(controller);
  rootElement.append(label, input);
};

/**
 * The view to select the active log levels.
 *
 * @param { HTMLElement }     rootElement
 * @param { LogUiControllerType } controller
 * @constructor
 */
const LogLevelControlView = (rootElement, controller) => {

  const render = levels =>
    levelFilterProjector(rootElement, controller, levels);

  controller.onChangeActiveLogLevel(render);
};

/**
 * The view to show the log messages.
 *
 * @param { HTMLElement }     rootElement
 * @param { LogUiControllerType } controller
 * @constructor
 */
const LogMessagesView = (rootElement, controller) => {

  const render = messages =>
      logMessagesProjector(rootElement, controller, messages);

  controller.onMessagesChange(render);
};
