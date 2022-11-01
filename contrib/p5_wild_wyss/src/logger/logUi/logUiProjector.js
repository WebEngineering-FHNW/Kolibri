export {
  logMessagesProjector,
  textFilterProjector,
  levelFilterProjector,
  contextInputProjector,
}

import { fst, snd }   from "../../../../../docs/src/kolibri/stdlib.js";
import { forEach }    from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";

/**
 * Projects the filtered log messages to the ui.
 *
 * @param { HTMLElement }         rootElement
 * @param { LogUiControllerType } controller
 * @param { stack }               stack
 */
const logMessagesProjector = (rootElement, controller, stack) => {
  const highlightMessage = (logMessage, searchText) =>
    logMessage.replaceAll(new RegExp(searchText,"gi"),
        matched => `<span class="highlighted">${matched}</span>`);

  rootElement.innerHTML   = `
    <button id="resetButton" class="resetButton">
        RESET
    </button>
  `;
  document.getElementById("resetButton").onclick = () => controller.resetLogMessages();

  const createPreElement  = (tuple, _) => {

    const line            = document.createElement("PRE");
    line.innerHTML        = highlightMessage(tuple(snd),controller.getTextFilter());
    line.classList.add("logMessage");
    line.classList.add(tuple(fst)(snd));
    rootElement.appendChild(line);
    rootElement.scrollTo(0, rootElement.scrollHeight);
  };

  forEach(stack)(createPreElement);
};

/**
 * Creates a label and an associated input element
 * parameterized by passing parameters.
 *
 * @param   { String }  type - the type of the input (eg. text)
 * @param   { String }  labelText
 * @param   { String }  id
 * @param   { String }  placeholder
 * @return  { HTMLCollection }
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

/**
 * Projects a filter input field to the ui.
 *
 * @param   { LogUiControllerType }  controller
 * @return  { [Element,Element] } - label & input Element
 */
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

/**
 * Projects a global context input field to the ui.
 *
 * @param   { LogUiControllerType }  controller
 * @return  { [Element,Element] } - label & input Element
 */
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

/**
 * Projects toggle buttons for each log level to the ui.
 *
 * @param { LogUiControllerType }   controller
 * @param { [LogLevelFilterType] }  levels
 */
const levelFilterProjector = (controller, levels) =>
    levels.map(projectLevelToggleControl(controller));

/**
 * Creates a toggle button and an associated label.
 * Returns a control whether the log entries of this {@link LogLevelType} are displayed or not.
 *
 * @type {
 *  (controller   :LogUiControllerType) =>
 *  (checkBoxPair :LogLevelFilterType)  =>
 *  HTMLSpanElement
 * }
 */
const projectLevelToggleControl = controller => checkBoxPair => {
  const toggleControlRoot  = document.createElement("SPAN"); // TODO remove
  const checkboxLabel = checkBoxPair(fst)(snd);
  toggleControlRoot.classList.add("loglevelButton");

  // TODO : better id
  const [label, checkbox] = createLabeledInputElement(
      "checkbox",
      checkboxLabel,
      checkboxLabel,
      ""
  );
  label.setAttribute("style", "pointer-events: none;"); // TODO remove

  checkbox.checked = checkBoxPair(snd);
  checkBoxPair(snd)
      ? toggleControlRoot.classList.remove ("checkedSpan")
      : toggleControlRoot.classList.add    ("checkedSpan");

  toggleControlRoot.append(checkbox, label);
  toggleControlRoot.onclick = _ => // TODO : event.onchange
    controller.flipLogLevel(checkBoxPair);

  return /**@type {HTMLSpanElement} */toggleControlRoot;
};
