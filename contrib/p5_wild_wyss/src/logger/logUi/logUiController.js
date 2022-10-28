export { LogUiController }

import { fst, snd, Pair }   from "../lamdaCalculus.js";
import { setGlobalContext } from "../logger.js";

/**
 * Processes the actions from the user interface and manages the model.
 *
 * @param   { LogUiModelType } model
 * @return  { LogUiControllerType }
 * @constructor
 */
const LogUiController = model => {

  /**
   * Set a new state of a given {@link LogLevelType}.
   * @param { LogLevelFilterType } logLevelToFlip
   */
  const flipLogLevel = logLevelToFlip => {
    const allLogLevels = updateLogLevelState(logLevelToFlip);
    model.setActiveLogLevel(allLogLevels);
  };

  /**
   * Changes the state of a given {@link LogLevelType}.
   * @param { LogLevelFilterType } logLevelToFlip
   */
  const updateLogLevelState = logLevelToFlip =>
      model.getAvailableLogLevels().map(
          logLevel => logLevel(fst) === logLevelToFlip(fst)
              ? Pair(logLevel(fst))(!logLevel(snd))
              : logLevel
      );

  /**
   * Checks whether a message matches the set filter.
   * @param   { (pairSelector) => LogLevelType | String } levelMessagePair
   * @return  { boolean }
   */
  const filter = levelMessagePair => {
    const logLevel          = levelMessagePair(fst);
    const levelLabel        = logLevel(snd);
    const activeLogLevels   = model.getAvailableLogLevels()
      .filter(level => true === level(snd))
      .map(level => level(fst)(snd));

    return activeLogLevels.includes(levelLabel)
      && messageIncludes(levelMessagePair(snd));
  };

  /**
   * Checks if a given text occurs in a log message.
   * @param   { String } text
   * @return  { boolean }
   */
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

    onMessagesChange:       model.onMessagesChange,
    resetLogMessages:       model.resetLogMessages,

    onTextFilterChange:     model.onTextFilterChange,
    setTextFilter:          model.setTextFilter,
    getTextFilter:          model.getTextFilter,

    setGlobalContext,
    flipLogLevel,
  }
};

