import { fst, Pair, snd } from "../lambda/church.js";
import { n0, n1, n2, n3, n4, n5, n9, }                                       from "../lambda/churchNumbers.js";


export {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
  levelNum,
  name
}

/**
 * @typedef { PairType<ChurchNumberType, String> } LogLevelType
 */

/**
 * @typedef { LOG_TRACE | LOG_DEBUG | LOG_INFO | LOG_WARN | LOG_ERROR | LOG_FATAL | LOG_NOTHING } LogLevelChoice
 */

/**
 * Alias for the use of the {@link Pair} constructor as a {@link LogLevelType}.
 * @type { LogLevelType }
 * @private
 */
const LogLevel = Pair;

/**
 * Getter for the church numeral value of a log level.
 * @type { (LogLevelType) => ChurchNumberType }
 */
const levelNum = fst;

/**
 * Getter for the name of a log level.
 * @type { (LogLevelType) => String }
 */
const name = /** @type { (LogLevelType) => String } */ snd;


/**
 * The logging level "trace"
 * @returns { LogLevelType }
 */
const LOG_TRACE = LogLevel(n0)("TRACE");

/**
 * The logging level "debug"
 * @returns { LogLevelType }
 */
const LOG_DEBUG = LogLevel(n1)("DEBUG");

/**
 * The logging level "info"
 * @returns { LogLevelType }
 */
const LOG_INFO = LogLevel(n2)("INFO");

/**
 * The logging level "warn"
 * @returns { LogLevelType }
 */
const LOG_WARN = LogLevel(n3)("WARN");

/**
 * The logging level "error"
 * @returns { LogLevelType }
 */
const LOG_ERROR = LogLevel(n4)("ERROR");

/**
 * The logging level "fatal"
 * @returns { LogLevelType }
 */
const LOG_FATAL = LogLevel(n5)("FATAL");

/**
 * The logging level "nothing".
 * Disables the logging level completely.
 * @returns { LogLevelType }
 */
const LOG_NOTHING = LogLevel(n9)("NOTHING");
