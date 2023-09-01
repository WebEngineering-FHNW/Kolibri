export {
  logMessagesProjector,
  levelFilterProjector,
  loggingSelectProjector,
}

import { dom }        from "../../../../../docs/src/kolibri/util/dom.js"
import { fst, snd }   from "../../../../../docs/src/kolibri/stdlib.js";
import { forEach }    from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
} from "../logger.js";

/**
 * Projects the filtered log messages to the ui.
 *
 * @param { HTMLElement }         rootElement
 * @param { LogUiControllerType } controller
 * @param { stack }               stack
 */
const logMessagesProjector = (rootElement, controller, stack) => {
  const highlightMessage = (logMessage, searchText) =>
    logMessage.replaceAll(new RegExp(searchText, "gi"),
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
 * @param   { String }  type - the type of the input (e.g. text)
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
 * Projects a select to change the active log level.
 *
 * @param   { LogUiControllerType }  controller
 * @return  { [Element,Element] } - label & input Element
 */
const loggingSelectProjector = controller => {

  const [label, select] = dom(`
          <label for="loggingLevels">Logging Level</label>
          <select name="levels" id="loggingLevels">
            <option          value="${LOG_TRACE(snd)}"  > ${LOG_TRACE(snd)}  </option>
            <option selected value="${LOG_DEBUG(snd)}"  > ${LOG_DEBUG(snd)}  </option>
            <option          value="${LOG_INFO(snd)}"   > ${LOG_INFO(snd)}   </option>
            <option          value="${LOG_WARN(snd)}"   > ${LOG_WARN(snd)}   </option>
            <option          value="${LOG_ERROR(snd)}"  > ${LOG_ERROR(snd)}  </option>
            <option          value="${LOG_FATAL(snd)}"  > ${LOG_FATAL(snd)}  </option>
            <option          value="${LOG_NOTHING(snd)}"> ${LOG_NOTHING(snd)}</option>
          </select> 
  `);

  select.onchange = _event => controller.setLoggingLevelByString(select.value);
  return [label, select];
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
 *  HTMLLabelElement
 * }
 */
const projectLevelToggleControl = controller => checkBoxPair => {
  const labelText = checkBoxPair(fst)(snd);

  const [label, checkbox] = createLabeledInputElement(
      "checkbox",
      labelText,
      "#toggleBtnId" + labelText,
      ""
  );
  label.classList.add("loglevelButton");

  checkbox.checked = checkBoxPair(snd);
  checkBoxPair(snd)
      ? label.classList.remove ("checkedToggleButton")
      : label.classList.add    ("checkedToggleButton");

  label.onclick = _ =>
    controller.flipLogLevel(checkBoxPair);

  return /**@type { HTMLLabelElement } */label;
};
