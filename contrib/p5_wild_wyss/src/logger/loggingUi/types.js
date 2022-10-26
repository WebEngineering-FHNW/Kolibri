/**
 * @typedef LogLevelFilterType
 * @type { (pairSelector) => LogLevelType | boolean }
 */

/**
 * @typedef LogUiModelType
 * @property { (Consumer) => void }           onChangeActiveLogLevel
 * @property { (LogLevelFilterType) => void } setActiveLogLevel
 * @property { () => [LogLevelFilterType] }   getAvailableLogLevels
 * @property { (Consumer) => void }           onTextFilterChange
 * @property { (String) => void }             setTextFilter
 * @property { () => String }                 getTextFilter
 * @property { (Predicate) => void }          filterAndNotify
 * @property { (Consumer) => void }           onMessagesChange
 * @property { (Consumer) => void }           onNewLogMessage
 */


