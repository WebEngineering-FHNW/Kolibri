export { LogUiController }

import { fst, snd, Pair }   from "../lamdaCalculus.js";
import { setGlobalContext } from "../logger.js";

/**
 *
 * @param model
 * @return {*}
 * @constructor
 */
const LogUiController = model => {

  const flipLogLevel = logLevelToFlip => {
    const allLogLevels = updateLogLevelState(logLevelToFlip);
    model.setActiveLogLevel(allLogLevels);
  };

  const updateLogLevelState = logLevelToFlip => model.getAvailableLogLevels()
      .map(logLevel =>
          logLevel(fst) === logLevelToFlip(fst)
              ? Pair(logLevel(fst))(!logLevel(snd))
              : logLevel
      );

  const filter = levelMessagePair => {
    const logLevel          = levelMessagePair(fst);
    const levelLabel        = logLevel(snd);
    const activeLogLevels   = model.getAvailableLogLevels()
      .filter(level => true === level(snd))
      .map(level => level(fst)(snd));

    return activeLogLevels.includes(levelLabel)
      && messageIncludes(levelMessagePair(snd));
  };

  const messageIncludes = text => {
    const textOfInterest  = model.getTextFilter().toLowerCase();
    const logMessage      = text.toLowerCase();
    return logMessage.includes(textOfInterest);
  };

  model.onNewLogMessage(        () => model.filterAndNotify(filter));
  model.onChangeActiveLogLevel( () => model.filterAndNotify(filter));
  model.onTextFilterChange(     () => model.filterAndNotify(filter));

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

