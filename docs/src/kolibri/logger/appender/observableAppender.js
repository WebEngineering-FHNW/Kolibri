/**
 * @module logger/observableAppender
 * The observable Appender is a decorator for other {@link AppenderType}s that notifies a listener about new log messages or
 * other interesting events.
 */
import {LOG_DEBUG, LOG_ERROR, LOG_FATAL, LOG_INFO, LOG_NOTHING, LOG_TRACE, LOG_WARN} from "../logLevel.js";

export { Appender}

/**
 * @typedef { (logLevel: LogLevelType, msg: ?String) => void } AppendListenerType
 * A log level of value {@link LOG_NOTHING} indicates that nothing has been logged, e.g. in a "reset".
 */

/**
 * The observable Appender is a decorator for other {@link AppenderType}s
 * that notifies a listener about log events that have been delegated to the decorated appender.
 * @constructor
 * @type {  <_T_>
 *     (appender: AppenderType<_T_>) =>
 *     (listener: AppendListenerType) =>
 *     AppenderType<_T_>
 * }
 */
const Appender = appender => listener => (
  /** @type {AppenderType} */ {
    trace:  arg => { const x = appender.trace(arg); listener(LOG_TRACE, arg); return x },
    debug:  arg => { const x = appender.debug(arg); listener(LOG_DEBUG, arg); return x },
    info:   arg => { const x = appender.info (arg); listener(LOG_INFO , arg); return x },
    warn:   arg => { const x = appender.warn (arg); listener(LOG_WARN , arg); return x },
    error:  arg => { const x = appender.error(arg); listener(LOG_ERROR, arg); return x },
    fatal:  arg => { const x = appender.fatal(arg); listener(LOG_FATAL, arg); return x },
    reset:  ()  => { const x = appender.reset();  listener(LOG_NOTHING); return x }, // we notify via log nothing to indicate the reset
    getValue: appender.getValue
  });

