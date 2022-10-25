export { Appender }

import {LOG_DEBUG, LOG_ERROR, LOG_FATAL, LOG_INFO, LOG_TRACE, LOG_WARN} from "../logger.js";
import {True} from "../lamdaCalculus.js";
import {Observable} from "../../../../../docs/src/kolibri/observable.js";
import {emptyStack, push} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {Pair} from "../../../../../docs/src/kolibri/stdlib.js"

/**
 * Provides console appender.
 * Using this appender you are able to log to the console.
 * @returns {AppenderType<>}
 * @constructor
 */
const Appender = () => ({
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  getValue,
  reset
});

const logObservable = Observable(emptyStack);
/**
 * This appender has no result
 * @function
 * @returns {IObservable<stack>}
 */
const getValue = () => logObservable;

const reset = () => {
  logObservable.setValue(emptyStack);
  return True;
};

/**
 * @type { (PrioritySupplier) => (String) => churchBoolean }
 */
const appenderCallback = type => msg => {
  const p = Pair(type)(msg);
  const newStack = push(logObservable.getValue())(p);
  logObservable.setValue(newStack);
  return True;
};

/**
 * the function to append trace logs in this application
 * @type { AppendCallback }
 */
const trace = appenderCallback(LOG_TRACE);

/**
 * the function to append debug logs in this application
 * @type { AppendCallback }
 */
const debug = appenderCallback(LOG_DEBUG);

/**
 * the function to append info logs in this application
 * @type { AppendCallback }
 */
const info = appenderCallback(LOG_INFO);

/**
 * the function to append warn logs in this application
 * @type { AppendCallback }
 */
const warn = appenderCallback(LOG_WARN);

/**
 * the function to append error logs in this application
 * @type { AppendCallback }
 */
const error = appenderCallback(LOG_ERROR);

/**
 * the function to append fatal logs in this application
 * @type { AppendCallback }
 */
const fatal = appenderCallback(LOG_FATAL);
