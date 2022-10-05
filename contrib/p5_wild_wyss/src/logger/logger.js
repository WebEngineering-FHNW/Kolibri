export {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
  traceLogger,
  debugLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  fatalLogger
}

import {
  Else,
  False,
  fst,
  LazyIf,
  pair,
  snd,
  Then,
} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";
import {leq, n0, n9, succ} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/church-numerals.js";

/**
 * A function where the log messages should be appended
 * @callback AppendType
 * @param { !String } message
 * @return { churchBoolean }
 * @example
 * const append = msg => {
 *  console.log(msg);
 *  return True;
 * }
 */

/**
 * A function that takes logging arguments and creates a formatted string.
 * @typedef MsgFormatter
 * @function
 * @pure
 * @type { (logLevel: String) => (logMessage: String) => String}
 */

/**
 * @typedef LogLevel
 * @type { (pairSelector) => churchNumber | String }
 */

/**
 * The currently active loglevel for this application.
 * @callback ActiveLogLevel
 * @return { pair<churchNumber, String>}
 * @example
 * const activeLogLevel = () => LOG_NOTHING;
 */

/**
 * Yields a custom configured log function.
 * Processes all log-actions which have a {@link LogLevel} equals or beneath
 * the {@link LogLevel} returned by the function "activeLogLevel".
 *
 * The result of the callback function {@link MsgFormatter} will be logged using the given {@link AppendType}.
 *
 * @pure if the parameters "callback" of type {@link AppendType} and msgFormatter of type {@link MsgFormatter} are pure.
 * @type    { (LogLevel) => (ActiveLogLevel) => (AppendType) => (MsgFormatter) => (String) => churchBoolean }
 * @private
 * @example
 * const log = logger(LOG_DEBUG)(() => LOG_DEBUG)(console.log)((_ => id);
 * log("Andri Wild");
 * // logs "Andri Wild" to console
 */
const logger = levelOfLogger => activeLogLevel => callback => msgFormatter => msg =>
  LazyIf(leq(activeLogLevel()(fst))(levelOfLogger(fst)))
    (Then(() => callback(msgFormatter(levelOfLogger(snd))(msg))))
    (Else(() => False));

/**
 * The logging level "trace"
 * @returns { LogLevel }
 */
const LOG_TRACE = pair(n0)("TRACE");

/**
 * The logging level "debug"
 * @returns { LogLevel }
 */
const LOG_DEBUG = pair(succ(LOG_TRACE(fst)))("DEBUG");

/**
 * The logging level "info"
 * @returns { LogLevel }
 */
const LOG_INFO = pair(succ(LOG_DEBUG(fst)))("INFO");

/**
 * The logging level "warn"
 * @returns { LogLevel }
 */
const LOG_WARN = pair(succ(LOG_INFO(fst)))("WARN");

/**
 * The logging level "error"
 * @returns { LogLevel }
 */
const LOG_ERROR = pair(succ(LOG_WARN(fst)))("ERROR");

/**
 * The logging level "fatal"
 * @returns { LogLevel }
 */
const LOG_FATAL = pair(succ(LOG_ERROR(fst)))("FATAL");

/**
 * The logging level "nothing".
 * Disables the logging level completely.
 * @returns { LogLevel }
 */
const LOG_NOTHING = pair(n9)("");

/**
 * Creates a new logger at log level "LOG_TRACE"
 * @example
 * const trace = traceLogger(console.log);
 * trace("a message to log to console");
 */
const traceLogger = logger(LOG_TRACE);

/**
 * Creates a new logger at log level "LOG_DEBUG"
 * @example
 * const debug = debugLogger(console.log);
 * debug("a message to log to console");
 */
const debugLogger = logger(LOG_DEBUG);

/**
 * Creates a new logger at log level "LOG_DEBUG"
 * @example
 * const debug = debugLogger(console.log);
 * debug("a message to log to console");
 */
const infoLogger = logger(LOG_INFO);

/**
 * Creates a new logger at log level "LOG_WARN"
 * @example
 * const warn = warnLogger(console.log);
 * warn("a message to log to console");
 */
const warnLogger = logger(LOG_WARN);

/**
 * Creates a new logger at log level "LOG_ERROR"
 * @example
 * const error = errorLogger(console.log);
 * error("a message to log to console");
 */
const errorLogger = logger(LOG_ERROR);

/**
 * Creates a new logger at log level "LOG_FATAL"
 * @example
 * const fatal = fatalLogger(console.log);
 * fatal("a message to log to console");
 */
const fatalLogger = logger(LOG_FATAL);


