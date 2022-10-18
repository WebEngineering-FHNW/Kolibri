export {LogUiModel}

import {LOG_DEBUG, LOG_ERROR, LOG_FATAL, LOG_INFO, LOG_TRACE, LOG_WARN} from "../logger";

const LogUiModel = appender => {

  const logLevelPool = [LOG_TRACE, LOG_INFO, LOG_DEBUG, LOG_WARN, LOG_ERROR, LOG_FATAL];

  const inactiveLogLevels = ObservableList([]);

  const onLogLevelChange = callback => {
    inactiveLogLevels.onAdd(callback);
    inactiveLogLevels.onDel(callback);
  };

  return {
    addInactiveLogLevel: inactiveLogLevels.add,
    delInactiveLogLevel: inactiveLogLevels.del,
    onLogLevelChange,
  }

};