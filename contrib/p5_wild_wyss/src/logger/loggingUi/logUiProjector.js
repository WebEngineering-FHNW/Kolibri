export {
  logMessagesProjector,
  textFilterProjector,
  levelFilterProjector,
  contextInputProjector,
}

import { fst, snd }   from "../../../../../docs/src/kolibri/stdlib.js";
import { forEach }    from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";

const logMessagesProjector = (rootElement, stack) => {
  rootElement.innerHTML = "";

  const createPreElement = (tuple, _) => {
    const line      = document.createElement("PRE");
    line.classList.add("logMessage");
    line.innerHTML  = tuple(snd);
    rootElement.appendChild(line);
    rootElement.scrollTo(0, rootElement.scrollHeight);

  };

  forEach(stack)(createPreElement);
};

/**
 *
 * @param { String }  type
 * @param { String }  labelText
 * @param { String }  id
 * @param { String }  placeholder
 * @return {HTMLCollection}
 */
const createLabeledInputElement = (type, labelText, id, placeholder) => {
    const labelClass = "text" === type ? "textLabel" : "";
    const template = document.createElement('DIV'); // only for parsing
    template.innerHTML = `
        <label class="${labelClass}" for="${id}">${labelText}</label>
        <input id=${id} type="${type}" placeholder="${placeholder}">
    `;
    return template.children;
};

const textFilterProjector = controller => {

  const [label, input] = createLabeledInputElement(
      "text",
      "Filter",
      "textLabelId",
      "Filter log messages"
  );
  input.oninput = _ => controller.setTextFilter(input.value);
  controller.onTextFilterChange(text => input.value = text);
  return [label, input];
};

const contextInputProjector = controller => {

  const [label, input] = createLabeledInputElement(
      "text",
      "Global Context",
      "globalContextId",
      "ch.fhnw"
  );
  input.oninput = _ => controller.setGlobalContext(input.value);
  return [label, input];
};

const levelFilterProjector = (rootElement, controller, levels) => {
  rootElement.innerHTML = '';
  levels.forEach(checkBoxPair =>
      rootElement.append(labeledCheckbox(controller, checkBoxPair))
  );
};

/**
 *
 * @param { } controller
 * @param checkBoxPair
 * @return {HTMLElement}
 */
const labeledCheckbox = (controller, checkBoxPair) => {
  const checkboxRoot  = document.createElement("SPAN");
  const checkboxLabel = checkBoxPair(fst)(snd);

  const [label, checkbox] = createLabeledInputElement(
      "checkbox",
      checkboxLabel,
      checkboxLabel,
      ""
  );
  label.setAttribute("style", "pointer-events: none;");

  checkbox.checked = checkBoxPair(snd);
  checkBoxPair(snd)
      ? checkboxRoot.classList.remove("checkedSpan")
      : checkboxRoot.classList.add("checkedSpan");

  checkboxRoot.append(checkbox, label);
  checkboxRoot.onclick = _ => {
    controller.flipLogLevel(checkBoxPair);
  };

  return checkboxRoot;
};
