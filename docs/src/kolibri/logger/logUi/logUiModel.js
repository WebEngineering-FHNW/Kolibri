export { LogUiModel }

import { Appender as ArrayAppender }   from "../appender/arrayAppender.js";
import { Appender as ObservableAppender }   from "../appender/observableAppender.js";
import { Observable } from "../../observable.js";
import {Pair, snd}    from "../../lambda/church.js"
import {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_FATAL,
  LOG_INFO,
  LOG_TRACE,
  LOG_WARN
}                     from "../logger.js";

/**
 * The model manages the data held in the observable.
 *
 * @return { LogUiModelType }
 * @constructor
 */
const LogUiModel = () => {

  let logListener = loglevel => {
    console.log("default LogListener called with " + loglevel(snd));
  };

  const arrayAppender      = ArrayAppender();
  const observableAppender = ObservableAppender(arrayAppender)( logListener );

  const levels = [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL];
  const logLevelFilterStates = Observable( levels.map(level => Pair(level)(true)));

  const filterText = Observable("");

  const messageListeners = [];

  /**
   * Adds a callback listener to the list.
   * Callbacks will be called by changing the filter.
   * @param { ConsumerType } listener
   */
  const onFilteredMessagesChange = listener => messageListeners.push(listener);

  /**
   * Filters the stacks messages and notifies all listeners.
   * @param { (PairSelectorType) => LogLevelType | String } predicate
   */
  const filterAndNotify = predicate => {
    const array     = observableAppender.getValue();
    const filtered  = array.filter( pair => pair(predicate));
    messageListeners.forEach(cb => cb(filtered));
  };

  return /** @type {LogUiModelType} */ {
    onChangeActiveLogLevel: logLevelFilterStates.onChange,
    setActiveLogLevel:      logLevelFilterStates.setValue,

    getAvailableLogLevels:  logLevelFilterStates.getValue,

    onTextFilterChange:     filterText.onChange,
    setTextFilter:          filterText.setValue,
    getTextFilter:          filterText.getValue,

    onMessagesChange:       onFilteredMessagesChange,
    onNewLogMessage:        newListener => logListener = newListener,
    resetLogMessages:       observableAppender.reset,

    filterAndNotify,
  }
};
