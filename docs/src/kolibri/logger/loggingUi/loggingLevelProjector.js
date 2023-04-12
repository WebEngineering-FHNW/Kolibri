import { dom }      from "../../util/dom.js"
import {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
  toString,
} from "../logLevel.js";

export {
  projectLoggingChoice,
}

let idPostfix = 0; // makes sure we have unique ids in case of many such controls

/**
 * Projects a select to change the global logging level.
 * This is a specialized projector that might later be generalized into a projector that
 * allows choosing from an arbitrary list of values.
 *
 * @param   { SimpleInputControllerType<String> }  loggingLevelController
 * @return  { [HTMLLabelElement, HTMLSelectElement] } - Label & Select Element
 */
const projectLoggingChoice = loggingLevelController => {
  const id = `loggingLevels-${idPostfix++}`;
  const [label, select] = dom(`
          <label for="${id}"></label>
          <select name="levels" id="${id}">
            <option value="${toString(LOG_TRACE)}"  > ${toString(LOG_TRACE)}  </option>
            <option value="${toString(LOG_DEBUG)}"  > ${toString(LOG_DEBUG)}  </option>
            <option value="${toString(LOG_INFO)}"   > ${toString(LOG_INFO)}   </option>
            <option value="${toString(LOG_WARN)}"   > ${toString(LOG_WARN)}   </option>
            <option value="${toString(LOG_ERROR)}"  > ${toString(LOG_ERROR)}  </option>
            <option value="${toString(LOG_FATAL)}"  > ${toString(LOG_FATAL)}  </option>
            <option value="${toString(LOG_NOTHING)}"> ${toString(LOG_NOTHING)}</option>
          </select> 
  `);

  // data binding
  loggingLevelController.onValueChanged(levelStr => select.value = levelStr);
  loggingLevelController.onLabelChanged(labelStr => label.textContent = /** @type { String } */ labelStr);

  // view binding
  select.onchange = _event => loggingLevelController.setValue(select.value);

  return /** @type { [HTMLLabelElement, HTMLSelectElement] } */ [label, select];
};
