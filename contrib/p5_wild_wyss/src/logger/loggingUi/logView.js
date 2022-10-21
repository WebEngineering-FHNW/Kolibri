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
  const render = checkBoxPair => {
    const logLevelLabel = checkBoxPair(fst)(snd);
    const   checked = checkBoxPair(snd);
    const checkbox  = document.createElement("INPUT");
    const label     = document.createElement("LABEL");
    label.innerHTML = logLevelLabel;
    label.setAttribute("for", logLevelLabel);
    checkbox.setAttribute("id", logLevelLabel);
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    rootElement.appendChild(checkbox);
    rootElement.appendChild(label);

    checkbox.onchange = _ => {
      controller.flipLogLevel(checkBoxPair);
    };
  };




  controller.onChangeActiveLogLevel(levels => {
    rootElement.innerHTML = '';
    levels.forEach(checkBoxPair => render(checkBoxPair))
  })
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