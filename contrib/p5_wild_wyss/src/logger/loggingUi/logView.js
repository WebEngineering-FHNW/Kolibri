import {forEach} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {fst, snd} from "../../../../../docs/src/kolibri/stdlib.js"

export {LogMessagesContainerView, LogLevelFilterControlView, LogContextView, TextFilterView }


const LogMessagesContainerView = (rootElement, controller) => {

  const render = messages =>
    logMessage(rootElement, messages);

  controller.onMessagesChange(render);
};

//
// const FilterView = (rootElement, controller)=>{
//   const textFilter = TextFilterView(rootElement, controller);
//   const checkBoxds = Che
// };

const TextFilterView = (rootElement, controller) => {
  const label = document.createElement("LABEL");
  label.innerHTML = "Filter ";
  label.setAttribute("for", "filterInput");

  const input = document.createElement("INPUT");
  input.setAttribute("id", "filterInput");

  input.oninput = _ => controller.setTextFilter(input.value);

  rootElement.append(label, input);

  const render = text => {
    input.value = text;
  };

  controller.onTextFilterChange(render);

};


const LogLevelFilterControlView = (rootElement, controller) => {
  const render = checkBoxPair => {
    const logLevelLabel = checkBoxPair(fst)(snd);
    const checked = checkBoxPair(snd);
    const checkbox = document.createElement("INPUT");
    const label = document.createElement("LABEL");
    label.innerHTML = logLevelLabel;
    label.setAttribute("for", logLevelLabel);
    checkbox.setAttribute("id", logLevelLabel);
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    rootElement.append(checkbox, label);

    checkbox.onchange = _ => controller.flipLogLevel(checkBoxPair);
  };


  controller.onChangeActiveLogLevel(levels => {
    rootElement.innerHTML = '';
    levels.forEach(checkBoxPair => render(checkBoxPair))
  })
};

const LogContextView = (rootElement, controller) => {
  const label = document.createElement("LABEL");
  label.innerHTML = "Global Context ";
  label.setAttribute("for", "globalContext");

  const input = document.createElement("INPUT");
  input.setAttribute("id", "globalContext");

  rootElement.append(label, input);

  input.oninput = _ => controller.setGlobalContext(input.value);
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