import {pop, forEach} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {snd, fst} from "../../../../../docs/src/kolibri/stdlib.js"
import {LOG_DEBUG, LOG_ERROR, LOG_FATAL, LOG_INFO, LOG_TRACE, LOG_WARN} from "../logger.js";

export {LogMessagesContainerView, LogLevelFilterControlView, LogContextView, LogMessageSearchView }


const LogMessagesContainerView = (rootElement, controller) => {

  const render = messages =>
    logMessage(rootElement, messages);

  controller.onMessagesChange(render);
};


const LogMessageSearchView = (rootElement, controller) => {

};



const LogLevelFilterControlView = (rootElement, controller) => {
  const checkboxes = [];
  [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL]
      .forEach(level => checkboxes[level(snd)] = true);

  const render = (key, value) => {
    const checkbox  = document.createElement("INPUT");
    const label     = document.createElement("LABEL");
    label.innerHTML = key;
    label.setAttribute("for", key);
    checkbox.setAttribute("id", key);
    checkbox.type = "checkbox";
    checkbox.checked = value;
    rootElement.appendChild(checkbox);
    rootElement.appendChild(label);
    controller.setActiveLogLevel(checkboxes);

    checkbox.onchange = _ => {
      const currentValue = {...controller.getActiveLogLevel() };
      currentValue[key] = !currentValue[key];
      controller.setActiveLogLevel(currentValue);
    };

    controller.onChangeActiveLogLevel( checkboxStates =>
        checkbox.checked = checkboxStates[key]
    );
  };

  for (const [key, value] of Object.entries(checkboxes)) {
    render(key, value)
  }

};

const LogContextView = (inputElement, controller) => {

};


const logMessage = (rootElement, stack) => {
  rootElement.innerHTML = "";

  const createPreElement = (tuple, _) => {
    const message = tuple(snd);
    const pre = document.createElement("PRE");
    pre.innerHTML = message;
    rootElement.appendChild(pre);
  };

  forEach(stack)(createPreElement);

};