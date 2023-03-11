/**
 * @typedef LogLevelFilterType
 * @type { (PairSelectorType) => LogLevelType | boolean }
 */

/**
 * @typedef LogUiModelType
 * @property { function(ConsumerType<>): void }   onChangeActiveLogLevel
 * @property { (LogLevelFilterType) => void } setActiveLogLevel
 * @property { () => [LogLevelFilterType] }   getAvailableLogLevels
 * @property { (ConsumerType) => void }           onTextFilterChange
 * @property { (String) => void }             setTextFilter
 * @property { () => String }                 getTextFilter
 * @property { (ConsumerType) => void }           onMessagesChange
 * @property { (ConsumerType) => void }           onNewLogMessage
 * @property { () => IObservable<stack> }     resetLogMessages
 * @property { (ConsumerType) => void }           filterAndNotify
 */

/**
 * @typedef LogUiControllerType
 * @property { function(ConsumerType<>): void }   onChangeActiveLogLevel
 * @property { (ConsumerType) => void }           onMessagesChange
 * @property { () => IObservable<stack> }     resetLogMessages
 * @property { (ConsumerType) => void }           onTextFilterChange
 * @property { (String) => void }             setTextFilter
 * @property { () => String }                 getTextFilter
 * @property { (String) => void }             setLoggingContext
 * @property { (String) => void }             setLoggingLevelByString
 * @property { (LogLevelFilterType) => void } flipLogLevel
 */
