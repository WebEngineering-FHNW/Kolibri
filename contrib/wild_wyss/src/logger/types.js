/**
 * This files contains all non-private types of the Kolibri's logging framework.
 * CONVENTION: All @typedef have the suffix "Type".
 */

// typedefs

/**
 * A Loglevel is a {@link Pair}, which consists of a {@link churchNumber} interpreted as level
 * and a {@link String} interpreted as label.
 * Given a {@link pairSelector}, either the level or the label can be selected.
 *
 * @typedef LogLevelType
 * @type { (pairSelector) => churchNumber | String }
 */

/**
 * LogMe is something that can be logged.
 * It represents a log message.
 * To log a simple message, just use a {@link String}.
 * If the log message is based on some calculations, you should consider to use a {@link Producer},
 * because the message can be lazy evaluated.
 * @typedef {String | Producer<String>} LogMeType
 */

/**
 * Provides appender for loglevel types  "trace", "debug", "info", "warn", "error" & "fatal".
 * Some appender may have a result, that can be collected using the getValue function.
 * @typedef { object } AppenderType
 * @template MyTemplate
 * @property { AppendCallback } trace - Defines the appending strategy for the {@link LOG_TRACE}-level messages.
 * @property { AppendCallback } debug - Defines the appending strategy for the {@link LOG_DEBUG}-level messages.
 * @property { AppendCallback } info - Defines the appending strategy for the {@link LOG_INFO}-level messages.
 * @property { AppendCallback } warn - Defines the appending strategy for the {@link LOG_WARN}-level messages.
 * @property { AppendCallback } error - Defines the appending strategy for the {@link LOG_ERROR}-level messages.
 * @property { AppendCallback } fatal - Defines the appending strategy for the {@link LOG_FATAL}-level messages.
 * @property { function(String=): MyTemplate} getValue - Some appender may produce a result, that can be collected using getValue.
 * @property { function(): MyTemplate } reset - Clean up the appender result. The next call of getValue returns the default value.
 */

/**
 * An object which consists of functions of type {@link Log}.
 * @typedef LoggerType
 * @property { Log } trace  - a function which logs a {@link LogMeType} on level {@link LOG_TRACE}
 * @property { Log } debug  - a function which logs a {@link LogMeType} on level {@link LOG_DEBUG}
 * @property { Log } info   - a function which logs a {@link LogMeType} on level {@link LOG_INFO}
 * @property { Log } warn   - a function which logs a {@link LogMeType} on level {@link LOG_WARN}
 * @property { Log } error  - a function which logs a {@link LogMeType} on level {@link LOG_ERROR}
 * @property { Log } fatal  - a function which logs a {@link LogMeType} on level {@link LOG_FATAL}
 */

// callbacks

/**
 * A function that takes logging arguments and creates a formatted string.
 * @callback FormatLogMessage
 * @function
 * @pure
 * @type { (context: String) => (logLevel: String) => (logMessage: String) => String}
 */

/**
 * Logs a given message.
 * @callback Log
 * @param { LogMeType }
 * @returns churchBoolean - {@link True} if the logging was successful
 *
 */

/**
 * The currently active logging level for this application.
 * @callback PrioritySupplier
 * @return { LogLevelType }
 */

/**
 * A callback which appends log messages in a desired way.
 * If the message has been appended successfully, {@link True} is returned.
 * @callback AppendCallback
 * @param { !String } message
 * @impure since appending a message always has side effects.
 * @returns { churchBoolean }
 * @example
 * const append = msg => {
 *  console.log(msg);
 *  return True;
 * }
 */
