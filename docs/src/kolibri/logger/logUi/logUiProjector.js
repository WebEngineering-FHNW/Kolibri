import { dom }      from "../../util/dom.js"
import { name }     from "../logger.js";
import {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
} from "../logger.js";

export {
  projectLoggingChoice,
}
/**
 * Projects a select to change the global logging level.
 * This is a specialized projector that might later be generalized into a projector that
 * allows choosing from an arbitrary list of values.
 *
 * @param   { SimpleInputControllerType<String> }  loggingLevelController
 * @return  { [HTMLLabelElement, HTMLSelectElement] } - Label & Select Element
 */
const projectLoggingChoice = loggingLevelController => {

  const [label, select] = dom(`
          <label for="loggingLevels"></label>
          <select name="levels" id="loggingLevels">
            <option          value="${LOG_TRACE(name)}"  > ${LOG_TRACE(name)}  </option>
            <option selected value="${LOG_DEBUG(name)}"  > ${LOG_DEBUG(name)}  </option>
            <option          value="${LOG_INFO(name)}"   > ${LOG_INFO(name)}   </option>
            <option          value="${LOG_WARN(name)}"   > ${LOG_WARN(name)}   </option>
            <option          value="${LOG_ERROR(name)}"  > ${LOG_ERROR(name)}  </option>
            <option          value="${LOG_FATAL(name)}"  > ${LOG_FATAL(name)}  </option>
            <option          value="${LOG_NOTHING(name)}"> ${LOG_NOTHING(name)}</option>
          </select> 
  `);

  // data binding
  loggingLevelController.onValueChanged(levelStr => select.value = levelStr);
  loggingLevelController.onLabelChanged(labelStr => label.textContent = /** @type { String } */ labelStr);

  // view binding
  select.onchange = _event => loggingLevelController.setValue(select.value);

  return /** @type { [HTMLLabelElement, HTMLSelectElement] } */ [label, select];
};
