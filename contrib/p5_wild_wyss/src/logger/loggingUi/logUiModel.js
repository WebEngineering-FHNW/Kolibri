export {LogUiModel}
import {Appender} from "../appender/observableAppender";
import {Observable} from "../../../../p6_haefliger_misic/branch-projector-pattern/observable/observable.js";

const LogUiModel = _ => {

  const inactiveLogLevels = Observable({trace: false, debug: false, info: false, warn: false, error: false, fatal: false});
  const globalContext     = Observable("ch.");
  const messages          = Observable([""]); // TODO use Stack

  const callback = msg => {
    messages.setValue([msg, ...messages.getValue()]);
  };

  const appender = Appender(callback);

  // const onLogLevelChange = callback => {
  //   inactiveLogLevels.onAdd(callback);
  //   inactiveLogLevels.onDel(callback);
  // };

  return {
    onChangeActiveLogLevel: inactiveLogLevels.onChange,
    setActiveLogLevel:      inactiveLogLevels.setValue,
    getActiveLogLevel:      inactiveLogLevels.getValue,

    onChangeGlobalContext:  globalContext.onChange,
    setGlobalContext:       globalContext.setValue,
    getGlobalContext:       globalContext.getValue,

    // addInactiveLogLevel: inactiveLogLevels.add,
    // delInactiveLogLevel: inactiveLogLevels.del,
    // onLogLevelChange,
  }

};