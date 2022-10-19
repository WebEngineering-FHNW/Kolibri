import {pop} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {snd, fst} from "../../../../../docs/src/kolibri/stdlib.js"

export {LogMessagesContainerView, LogLevelControlView, LogContextView, LogMessageSearchView }




const LogMessagesContainerView = (rootElement, controller) => {



  const render = messages =>
    logMessage(rootElement, messages);

  controller.onMessagesChange(render);
};




const LogMessageSearchView = (rootElement, controller) => {

};



const LogLevelControlView = (rootElement, controller) => {

  const render = value => {
    logLevelButtonProjector(rootElement, controller, value);
  };

  controller.onChangeActiveLogLevel(render);
};

const LogContextView = (inputElement, controller) => {

};

const globalContextProjector = (inputElement, controller) => {
};


const logLevelButtonProjector = (rootElement, controller, logLevels) => {

  for (const [key, value] of Object.entries(logLevels)) {
    const el = document.getElementById(key);

    if (null === el) {
      const checkbox  = document.createElement("INPUT");
      const label     = document.createElement("LABEL");
      label.innerHTML = key;
      label.setAttribute("for", key);
      checkbox.setAttribute("id", key);
      checkbox.type = "checkbox";
      checkbox.innerHTML = key;
      checkbox.checked = value;
      rootElement.appendChild(checkbox);
      rootElement.appendChild(label)
    } else {
      el.checked = value;
    }
  }
};

const logMessage = (rootElement, stack) => {

  const tuple = pop(stack)(snd);
  const message = tuple(snd);
  const pre = document.createElement("PRE");
  pre.innerHTML = message;
  rootElement.appendChild(pre);
};