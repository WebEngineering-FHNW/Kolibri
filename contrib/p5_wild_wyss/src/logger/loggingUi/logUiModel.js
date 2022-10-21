
export { LogUiModel }

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
 *
 * @param { AppenderType<Observable<stack>> } appender
 * @return {*}
 * @constructor
 */
const LogUiModel = appender => {
  const logLevelFilterStates =
    Observable(
      [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL]
      .map(level => Pair(level)(true)));

  const filterText = Observable("");

  const callbacks = [];

  const onFilteredMessagesChange = item => callbacks.push(item);

  const filterAndNotify = predicate => {
    const stack = appender.getValue().getValue();
    const filtered =  filter(predicate)(stack);
    callbacks.forEach(cb => cb(filtered));
  };

  return {
    onChangeActiveLogLevel: logLevelFilterStates.onChange,
    setActiveLogLevel:      logLevelFilterStates.setValue,

    getAvailableLogLevels:  logLevelFilterStates.getValue,

    onTextFilterChange:     filterText.onChange,
    setTextFilter:          filterText.setValue,
    getTextFilter:          filterText.getValue,

    filterAndNotify:        filterAndNotify,
    onMessagesChange:       onFilteredMessagesChange,
    onNewLogMessage:        appender.getValue().onChange
  }

};