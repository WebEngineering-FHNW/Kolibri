export {LogUiModel}
import {Observable} from "../../../../../docs/src/kolibri/observable.js";
import {filter} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {fst, snd} from "../lamdaCalculus.js";

/**
 *
 * @param { AppenderType<Observable<stack>> } appender
 * @return {*}
 * @constructor
 */
const LogUiModel = appender => {
  const logLevelFilterItems = Observable([]);
  const callbacks = [];

  const onFilteredMessagesChange = item => callbacks.push(item);


  const predicate = pair => {
    const type = pair(fst);
    const level =  type(snd);

    const activeLogLevels = Object.entries(logLevelFilterItems.getValue())
        .filter(e => true === e[1])
        .map(e => e[0]);

      return activeLogLevels.includes(level);
  };

  const applyFilter = () => {
    const stack = appender.getValue().getValue();
    return filter(predicate)(stack)
  };

  appender.getValue().onChange( _ => {
    const filtered = applyFilter();
    callbacks.forEach(cb => cb(filtered));
  });

  logLevelFilterItems.onChange( _ => {
    const filtered = applyFilter();
    callbacks.forEach(cb => cb(filtered))
  });

  return {
    onChangeActiveLogLevel: logLevelFilterItems.onChange,
    setActiveLogLevel:      logLevelFilterItems.setValue,
    getActiveLogLevel:      logLevelFilterItems.getValue,

    onMessagesChange:       onFilteredMessagesChange,
  }

};