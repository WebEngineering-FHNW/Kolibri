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

const LogMessagesView = (rootElement, controller) => {

  const render = messages =>
    logMessagesProjector(rootElement, messages);

  controller.onMessagesChange(render);
};

const LogLevelControlView = (rootElement, controller) => {

  const render = levels => {
    levelFilterProjector(rootElement, controller, levels);
  };

  controller.onChangeActiveLogLevel(render);
};

const TextFilterView = (rootElement, controller) => {
  const [label, input] = textFilterProjector(controller);
  rootElement.append(label, input);
};

const LogContextView = (rootElement, controller) => {
  const [label, input] = contextInputProjector(controller);
  rootElement.append(label, input);
};
