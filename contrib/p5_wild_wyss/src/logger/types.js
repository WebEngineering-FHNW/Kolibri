/**
 * This files contains all non-private types of the Kolibri's logging framework.
 * CONVENTION: All @typedef have the suffix "Type"
 */

// typedefs

/**
 * A function that takes logging arguments and creates a formatted string.
 * @callback MsgFormatType
 * @function
 * @pure
 * @type { (context: String) => (logLevel: String) => (logMessage: String) => String}
 */

/**
 * A Loglevel is a {@link Pair}, which consists of a {@link churchNumber } interpreted as level
 * and a {@link String} interpreted as label.
 * Given a {@link pairSelector}, either the level or the label can be selected.
 *
 * @typedef LogLevelType
 * @type { (pairSelector) => churchNumber | String }
 */

/**
 * LogMe represents a log message.
 * To log a simple message, just use a {@link String}.
 * If the log message is based on some calculations, you should consider to use a {@link produce},
 * because the message can be lazy evaluated.
 * @typedef {String | Producer<String>} LogMeType
 */

/**
 * Provides appender for loglevel types  "trace", "debug", "info", "warn", "error" & "fatal".
 * Some appender may have a result, that can be collected using the getValue function.
 * @typedef AppenderType
 * @template T - the result type of the getValue function. If the appender has no result, {@link void} should be used.
 * @template b - a delimiter to separate the individual appended messages.
 * @property { append } trace - Defines the appending strategy for the {@link LOG_TRACE}-level messages.
 * @property { append } debug - Defines the appending strategy for the {@link LOG_DEBUG}-level messages.
 * @property { append } info - Defines the appending strategy for the {@link LOG_INFO}-level messages.
 * @property { append } warn - Defines the appending strategy for the {@link LOG_WARN}-level messages.
 * @property { append } error - Defines the appending strategy for the {@link LOG_ERROR}-level messages.
 * @property { append } fatal - Defines the appending strategy for the {@link LOG_FATAL}-level messages.
 * @property { function(String=): *} getValue - Some appender may produce a result, that can be collected using getValue.
 */

/**
 * An object which consists of functions of type {@link log}.
 * @typedef LoggerType
 * @property { log } trace - a function which logs a {@link LogMeType} on level {@link LOG_TRACE}
 * @property { log } debug - a function which logs a {@link LogMeType} on level {@link LOG_DEBUG}
 * @property { log } info - a function which logs a {@link LogMeType} on level {@link LOG_INFO}
 * @property { log } warn - a function which logs a {@link LogMeType} on level {@link LOG_WARN}
 * @property { log } error - a function which logs a {@link LogMeType} on level {@link LOG_ERROR}
 * @property { log } fatal - a function which logs a {@link LogMeType} on level {@link LOG_FATAL}
 */

// callbacks

/**
 * Logs a given message.
 * @callback log
 * @param { LogMeType }
 * @returns churchBoolean - {@link True} if the logging was successful
 * @example
 *
 */

/**
 * The currently active loglevel for this application.
 * @callback activeLogLevel
 * @return { pair<churchNumber, String>}
 * @example
 * const activeLogLevel = () => LOG_NOTHING;
 */

/**
 * A callback which appends log messages in a desired way.
 * If the message has been appended successfully, {@link True} is returned.
 * @callback append
 * @param { !String } message
 * @impure since appending a message always has side effects.
 * @returns { churchBoolean }
 * @example
 * const append = msg => {
 *  console.log(msg);
 *  return True;
 * }
 */

/**
 * A callback which takes no arguments and returns an {@link a}
 * @template a
 * @callback produce
 * @returns a
 */

/**
 * A callback which takes one argument and does something with it. (Usually this leads in a side effect)
 * @template a
 * @callback consume
 * @impure
 * @param a
 * @returns void
 */