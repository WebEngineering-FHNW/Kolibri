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
} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";
import {leq, n0, n9, succ} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/church-numerals.js";

/**
 * The Logger function yields a custom configured log function.
 *
 * @param {function} logLevel caused by a logger call
 * @param {function} activated caused by a logger call
 * @param {function} callback caused by a logger call
 * @param {String} msg the processed msg
 * @param {boolean} state the logger's on/off state
 * @return { function(x:String): function(y:boolean): {f: { y x }} }
 * @example
 * const log = Logger(msg => console.log(msg));
 * log("action")(true);
 */
const Logger = logLevel => activated => callback => msg =>
  LazyIf( leq( activated() )( logLevel ) )
        ( Then(() => callback(msg) ) )
        ( Else(() => False ) );


/**
 * Define log levels
 * */
const LOG_TRACE = n0;
const LOG_DEBUG = succ(LOG_TRACE);
const LOG_INFO  = succ(LOG_DEBUG);
const LOG_WARN  = succ(LOG_INFO);
const LOG_ERROR = succ(LOG_WARN);
const LOG_FATAL = succ(LOG_ERROR);


const TraceLogger = Logger(LOG_TRACE);
const DebugLogger = Logger(LOG_DEBUG);
const WarnLogger  = Logger(LOG_WARN);
const ErrorLogger = Logger(LOG_ERROR);
const FatalLogger = Logger(LOG_FATAL);


const LOG_NOTHING = n9;
