export {LogUiModel}
import {Appender} from "../appender/observableAppender.js";
import {Observable} from "../../../../../docs/src/kolibri/observable.js";

/**
 *
 * @param { AppenderType<Observable<stack>> } appender
 * @return {*}
 * @constructor
 */
const LogUiModel = appender => {

  const inactiveLogLevels = Observable({trace: false, debug: false, info: false, warn: false, error: false, fatal: false});


  return {
    onChangeActiveLogLevel: inactiveLogLevels.onChange,
    setActiveLogLevel:      inactiveLogLevels.setValue,
    getActiveLogLevel:      inactiveLogLevels.getValue,

    getMessages:            appender.getValue().getValue,
    onMessagesChange:       appender.getValue().onChange,
  }

};