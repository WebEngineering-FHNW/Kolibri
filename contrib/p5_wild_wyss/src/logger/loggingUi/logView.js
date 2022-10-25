export {
  LogMessagesView,
  LogContextView,
  FilterView,
}

import {
  levelFilterProjector,
  logMessagesProjector,
  textFilterProjector,
} from "./logUiProjector.js";


const LogMessagesView = (rootElement, controller) => {

  const render = messages =>
    logMessagesProjector(rootElement, messages);

  controller.onMessagesChange(render);
};


const FilterView = (rootElement, controller) => {

  const checkboxRoot    = document.createElement("DIV");
  const textFilterRoot  = textFilterProjector(controller);

  controller.onChangeActiveLogLevel(levels => {
    checkboxRoot.innerHTML = '';
    levels.forEach(checkBoxPair =>
        checkboxRoot.append(levelFilterProjector(controller, checkBoxPair))
    );
  });

  rootElement.append(textFilterRoot, checkboxRoot);
};

const LogContextView = (rootElement, controller) => {
  const label       = document.createElement("LABEL");
  const input       = document.createElement("INPUT");

  label.innerHTML   = "Global Context ";
  label.setAttribute("for", "globalContext");
  input.setAttribute("id", "globalContext");

  rootElement.append(label, input);

  input.oninput = _ => controller.setGlobalContext(input.value);
};
