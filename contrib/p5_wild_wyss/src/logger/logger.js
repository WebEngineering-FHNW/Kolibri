export {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
  TraceLogger,
  DebugLogger,
  WarnLogger,
  ErrorLogger,
  FatalLogger
}

import {
  Else,
  False,
  LazyIf,
  Then,
  pair,
  fst,
  snd,
} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";
import {leq, n0, n1, n9, succ} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/church-numerals.js";

/**
 * The Logger function yields a custom configured log function.
 *
 * @param {function} levelOfLogger level of the logger itself
 * @param {function} activeLogLevel the currently active log level
 * @param {function} callback caused by a logger call
 * @param {String} msg the processed msg
 * @return TODO
 * @example
 * const log = Logger(msg => console.log(msg));
 * log("action")(true);
 */
const Logger = levelOfLogger => activeLogLevel => callback => msg => {
  LazyIf(leq(activeLogLevel()(fst))(levelOfLogger(fst)))
  (Then(() => callback(levelOfLogger(snd) + ": " + msg)))
  (Else(() => False));
};

/**
 * A logging function that logs the given message.
 * @typedef Logger
 * @param { !string } msg - the message to log
 * @returns { void }
 */

/**
 * Defines log levels
 * @typedef  {pair(churchNumber)(String)} LogLevel
 * */

/**
 * The logging level "trace"
 * @return { LogLevel }
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
 * Creates a new Logger at log level "LOG_TRACE"
 * @constructor
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const trace = TraceLogger(console.log);
 * trace("a message to log to console");
 */
const TraceLogger = Logger(LOG_TRACE);

/**
 * Creates a new Logger at log level "LOG_DEBUG"
 * @constructor
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const debug = DebugLogger(console.log);
 * debug("a message to log to console");
 */
const DebugLogger = Logger(LOG_DEBUG);

/**
 * Creates a new Logger at log level "LOG_WARN"
 * @constructor
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const warn = WarnLogger(console.log);
 * warn("a message to log to console");
 */
const WarnLogger = Logger(LOG_WARN);

/**
 * Creates a new Logger at log level "LOG_ERROR"
 * @constructor
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const error = ErrorLogger(console.log);
 * error("a message to log to console");
 */
const ErrorLogger = Logger(LOG_ERROR);

/**
 * Creates a new Logger at log level "LOG_FATAL"
 * @constructor
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const fatal = FatalLogger(console.log);
 * fatal("a message to log to console");
 */
const FatalLogger = Logger(LOG_FATAL);


