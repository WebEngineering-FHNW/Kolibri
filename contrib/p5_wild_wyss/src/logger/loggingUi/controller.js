export {LogUiController}

import {fst, snd, Pair} from "../lamdaCalculus.js";
import {setGlobalContext} from "../logger.js";

/**
 *
 * @param model
 * @return {*}
 * @constructor
 */
const LogUiController = model => {

  const flipLogLevel = logLevelPair => {
    const allLogLevels = model.getAvailableLogLevels()
      .map(logLevel =>
        logLevel(fst) === logLevelPair(fst)
          ? Pair(logLevel(fst))(!logLevel(snd))
          : logLevel
      );
    model.setActiveLogLevel(allLogLevels);
  };

  return {
    onChangeActiveLogLevel: model.onChangeActiveLogLevel,

    getMessages:            model.getMessages,
    onMessagesChange:       model.onMessagesChange,

    onTextFilterChange:     model.onTextFilterChange,
    setTextFilter:          model.setTextFilter,

    setGlobalContext:       setGlobalContext,
    flipLogLevel:           flipLogLevel
  }
};

