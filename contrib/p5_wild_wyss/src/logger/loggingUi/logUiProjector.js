export {
  logMessagesProjector,
  textFilterProjector,
  levelFilterProjector,
}

import { fst, snd }   from "../../../../../docs/src/kolibri/stdlib.js";
import { forEach }    from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";

const logMessagesProjector = (rootElement, stack) => {
  rootElement.innerHTML = "";

  const createPreElement = (tuple, _) => {
    const line      = document.createElement("PRE");
    line.innerHTML  = tuple(snd);
    rootElement.appendChild(line);
  };

  forEach(stack)(createPreElement);
};


const textFilterProjector = controller => {
  const rootElement   = document.createElement("DIV");
  const input         = document.createElement("INPUT");
  const label         = document.createElement("LABEL");

  label.innerHTML     = "Filter ";
  label.setAttribute("for", "filterInput");
  input.setAttribute("id", "filterInput");

  input.oninput = _ => controller.setTextFilter(input.value);

  rootElement.append(label, input);

  controller.onTextFilterChange(text => input.value = text);

  return rootElement;
};


const levelFilterProjector = (controller, checkBoxPair) => {
  const checkboxRoot  = document.createElement("SPAN");
  const label         = document.createElement("LABEL");
  const checkbox      = document.createElement("INPUT");

  const logLevelLabel = checkBoxPair(fst)(snd);
  const checked       = checkBoxPair(snd);

  label.innerHTML     = logLevelLabel;
  checkbox.type       = "checkbox";
  checkbox.checked    = checked;
  checkbox.setAttribute("id", logLevelLabel);
  label.setAttribute("for", logLevelLabel);

  checkboxRoot.append(checkbox, label);

  checkbox.onchange = _ => controller.flipLogLevel(checkBoxPair);

  return checkboxRoot;
};
