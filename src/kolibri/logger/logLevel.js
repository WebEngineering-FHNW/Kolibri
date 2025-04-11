import {fst, Left, Right, snd} from "../lambda/church.js";
import {Pair}                  from "../stdlib.js";

export {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
  contains,
  toString,
  fromString,
}

/**
 * Log levels can be compared for equality by instance identity.
 * See also {@link contains},{@link toString},{@link fromString}.
 * @pure
 * @immutable
 * @typedef { PairSelectorType<Number, String> } LogLevelType
 */

/**
 * Alias for the use of the {@link Pair} constructor as a {@link LogLevelType}.
 * @type { PairType<Number, String> }
 * @private
 */
const LogLevel = Pair;

/**
 * Getter for the numeric value of a log level.
 * @private
 */
const levelNum = fst;

/**
 * Getter for the name of a log level.
 * @private
 */
const name = snd;

/**
 * @type { LogLevelType }
 */
const LOG_TRACE = LogLevel(0)("TRACE");

/**
 * @type { LogLevelType }
 */
const LOG_DEBUG = LogLevel(1)("DEBUG");

/**
 * @type { LogLevelType }
 */
const LOG_INFO = LogLevel(2)("INFO");

/**
 * @type { LogLevelType }
 */
const LOG_WARN = LogLevel(3)("WARN");

/**
 * @type { LogLevelType }
 */
const LOG_ERROR = LogLevel(4)("ERROR");

/**
 * @type { LogLevelType }
 */
const LOG_FATAL = LogLevel(5)("FATAL");

/**
 * @type { LogLevelType }
 */
const LOG_NOTHING = LogLevel(6)("NOTHING");

/**
 * @type { Array<LogLevelType> }
 */
const ALL_LOG_LEVELS = [
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
];

/**
 * Whether the logger will log at the current logging level.
 * @type { (loggingLevel: LogLevelType, loggerLevel: LogLevelType) => Boolean }
 */
const contains = (loggingLevel, loggerLevel) => loggerLevel(levelNum) >= loggingLevel(levelNum);

/**
 * @type { (logLevel: LogLevelType) => String }
 */
const toString = logLevel => logLevel(name);

/**
 * @type { (str: String) => EitherType<String, LogLevelType> }
 */
const fromString = str => {
  const level = ALL_LOG_LEVELS.find(logLevel => logLevel(name) === str);
  return level
    ? Right(level)
    : Left(`Unknown log level: "${str}"`);
};
