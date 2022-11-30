export { LogUiController }

import { LogUiModel }       from "./logUiModel.js";
import { fst, snd, Pair }   from "../lamdaCalculus.js";
import {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_FATAL,
  LOG_INFO,
  LOG_TRACE,
  LOG_WARN,
  setGlobalContext,
  setLoggingLevel
} from "../logger.js";

/**
 * Processes the actions from the user interface and manages the model.
 *
 * @return  { LogUiControllerType }
 * @constructor
 */
const LogUiController = () => {

  const model = LogUiModel();

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

  /**
   * Sets the active logging level according to its string representation.
   * @param { String } levelString
   */
  const setLoggingLevelByString = levelString => {
    const newLoggingLevel = [LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL]
        .filter(lvl => {
          const lvlString =  /** @type String */ lvl(snd);
          return lvlString === levelString;
        });
      setLoggingLevel(newLoggingLevel[0])
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
    setLoggingLevelByString,
    flipLogLevel,
  }
};

