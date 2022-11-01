export { LogUiModel }

import { Appender }     from "../appender/observableAppender.js";
import { Observable }   from "../../../../../docs/src/kolibri/observable.js";
import { filter }       from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { Pair }         from "../../../../../docs/src/kolibri/stdlib.js"
import {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_FATAL,
  LOG_INFO,
  LOG_TRACE,
  LOG_WARN
} from "../logger.js";

/**
 * The model manages the data held in the observable.
 *
 * @return { LogUiModelType }
 * @constructor
 */
const LogUiModel = () => {

  const appender = Appender();

  const levels = [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL];
  const logLevelFilterStates = Observable( levels.map(level => Pair(level)(true)));

  const filterText = Observable("");

  const messageListeners = [];

  /**
   * Adds a callback listener to the list.
   * Callbacks will be called by changing the filter.
   * @param { Consumer } listener
   */
  const onFilteredMessagesChange = listener => messageListeners.push(listener);

  /**
   * Filters the stacks messages and notifies all listeners.
   * @param { (pairSelector) => LogLevelType | String } predicate
   */
  const filterAndNotify = predicate => {
    const stack     = appender.getValue().getValue();
    const filtered  =  filter(predicate)(stack);
    messageListeners.forEach(cb => cb(filtered));
  };

  return {
    onChangeActiveLogLevel: logLevelFilterStates.onChange,
    setActiveLogLevel:      logLevelFilterStates.setValue,

    getAvailableLogLevels:  logLevelFilterStates.getValue,

    onTextFilterChange:     filterText.onChange,
    setTextFilter:          filterText.setValue,
    getTextFilter:          filterText.getValue,

    onMessagesChange:       onFilteredMessagesChange,
    onNewLogMessage:        appender.getValue().onChange,
    resetLogMessages:       appender.reset,

    filterAndNotify,
  }
};