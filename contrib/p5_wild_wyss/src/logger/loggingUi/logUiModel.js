import {LOG_DEBUG, LOG_ERROR, LOG_FATAL, LOG_INFO, LOG_TRACE, LOG_WARN} from "../logger.js";

export {LogUiModel}
import {Observable} from "../../../../../docs/src/kolibri/observable.js";
import {filter} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {Pair,snd, fst} from "../../../../../docs/src/kolibri/stdlib.js"

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

  const predicate = levelMessagePair => {
    const logLevel = levelMessagePair(fst);

    const levelLabel =  logLevel(snd);

    const activeLogLevels = logLevelFilterStates.getValue()
      .filter(level => true === level(snd))
      .map(level => level(fst)(snd));

    return activeLogLevels.includes(levelLabel) && messageIncludes(levelMessagePair(snd));
  };

  const messageIncludes = text => {
    const textOfInterest = filterText.getValue().toLowerCase();
    const logMessage = text.toLowerCase();
    return logMessage.includes(textOfInterest);
  };

  const notifyListeners = () => {
    const stack = appender.getValue().getValue();
    const filtered =  filter(predicate)(stack);
    callbacks.forEach(cb => cb(filtered));
  };

  appender.getValue().onChange(notifyListeners);

  logLevelFilterStates.onChange(notifyListeners);

  return {
    onChangeActiveLogLevel: logLevelFilterStates.onChange,
    setActiveLogLevel:      logLevelFilterStates.setValue,

    getAvailableLogLevels:  logLevelFilterStates.getValue,

    onTextFilterChange:     filterText.onChange,
    setTextFilter:          filterText.setValue,

    onMessagesChange:       onFilteredMessagesChange,
  }

};