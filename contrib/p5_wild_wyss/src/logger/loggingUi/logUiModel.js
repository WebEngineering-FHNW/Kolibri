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
  const logLevelFilter = Observable({});
  const callbacks = [];

  const onFilteredMessagesChange = item => callbacks.push(item);


  const predicate = pair => {
    const type = pair(fst);
    const level =  type(snd);

    const activeLoglevels = Object.entries(logLevelFilter.getValue())
        .filter(e => true === e[1])
        .map(e => e[0]);

      return activeLoglevels.includes(level);
  };

  const applyFilter = () => {
    const stack = appender.getValue().getValue();
    return filter(predicate)(stack)
  };



  appender.getValue().onChange( _ => {
    const filtered = applyFilter();
    callbacks.forEach(cb => cb(filtered));
  });

  logLevelFilter.onChange( _ => {
    const filtered = applyFilter();
    callbacks.forEach(cb => cb(filtered))
  });



  return {
    onChangeActiveLogLevel: logLevelFilter.onChange,
    setActiveLogLevel:      logLevelFilter.setValue,
    getActiveLogLevel:      logLevelFilter.getValue,

    onMessagesChange:       onFilteredMessagesChange,
  }

};