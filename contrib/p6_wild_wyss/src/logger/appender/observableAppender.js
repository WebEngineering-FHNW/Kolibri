export { Appender }

import { Pair }                   from "../../../../../docs/src/kolibri/stdlib.js"
import { Observable }             from "../../../../../docs/src/kolibri/observable.js";
import { emptyStack, push, size } from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {
  False,
  True,
  jsNum,
  LazyIf,
  Then,
  Else,
  id,
} from "../lamdaCalculus.js";
import {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_FATAL,
  LOG_INFO,
  LOG_TRACE,
  LOG_WARN,
} from "../logger.js";

const MAX_STACK_ELEMENTS    = Number.MAX_SAFE_INTEGER -1;
const MIN_STACK_SIZE        = 2;

const OVERFLOW_LOG_MESSAGE  =
  "LOG ERROR: Despite running the chosen eviction strategy, the array was full! The first third of the log messages have been deleted!";

/**
 * This is the default function that gets called when the defined limit has been reached.
 * It will empty the whole stack.
 * @param   { IObservable<stack> } currentValue
 * @returns { IObservable<stack> }
 */
const DEFAULT_CACHE_EVICTION_STRATEGY =  currentValue => {
  // clear stack
  currentValue.setValue(emptyStack);
  return currentValue;
};

/**
 * Provides an observable appender.
 * Use {@link getValue} to get the observable and register yourself on changes
 * and use {@link reset} to clear the array.
 * @param { Number                             } limit           - the max amount of log messages to keep.
 * @param { UnaryOperation<IObservable<stack>> } cacheEvictionStrategy  - This function is called, as soon as the
 *      defined limit of log messages is reached. You obtain the current appender
 *      value. Return a new value which will be used as the new value of this appender.
 *      If this parameter is not set, then all log messages until now will be discarded.
 * @returns { AppenderType.<IObservable<stack>> }
 */
const Appender = (limit = MAX_STACK_ELEMENTS, cacheEvictionStrategy = DEFAULT_CACHE_EVICTION_STRATEGY) => {
  // make sure, the stack is not defined too small.
  const calculatedLimit = MIN_STACK_SIZE < limit ? limit: MIN_STACK_SIZE;
  return {
    trace:  trace(calculatedLimit)(cacheEvictionStrategy),
    debug:  debug(calculatedLimit)(cacheEvictionStrategy),
    info:   info(calculatedLimit) (cacheEvictionStrategy),
    warn:   warn(calculatedLimit) (cacheEvictionStrategy),
    error:  error(calculatedLimit)(cacheEvictionStrategy),
    fatal:  fatal(calculatedLimit)(cacheEvictionStrategy),
    getValue,
    reset
  };
};

/**
 *
 * @type { IObservable<stack> }
 */
let logObservable = Observable(emptyStack);

/**
 * This appender returns an observable containing a stack
 * @function
 * @returns { IObservable<stack> }
 */
const getValue = () => logObservable;

/**
 *
 * @returns { IObservable<stack> }
 */
const reset = () => {
  const lastValue = logObservable.getValue();
  logObservable.setValue(emptyStack);
  // copy observable
  return Observable(lastValue);
};

/**
 * Appends the next log message to the stack.
 * @type {
 *          (type: PrioritySupplier)  =>
 *          (number)                  =>
 *          (onOverflow: *)           =>
 *          (msg: String)             =>
 *          churchBoolean
 *      }
 */
const appenderCallback = type => limit => onOverflow => msg =>
  LazyIf(full(limit))
    // if the stack is full, call the overflow function and add the new value afterward.
    (Then(() => append(type)(msg)(limit)(onOverflow)))
    // in any other case just append the new message.
    (Else(() => append(type)(msg)(limit)(id)));


/**
 * the function to append trace logs in this application
 */
const trace = appenderCallback(LOG_TRACE);

/**
 * the function to append debug logs in this application
 */
const debug = appenderCallback(LOG_DEBUG);

/**
 * the function to append info logs in this application
 */
const info = appenderCallback(LOG_INFO);

/**
 * the function to append warn logs in this application
 */
const warn = appenderCallback(LOG_WARN);

/**
 * the function to append error logs in this application
 */
const error = appenderCallback(LOG_ERROR);

/**
 * the function to append fatal logs in this application
 */
const fatal = appenderCallback(LOG_FATAL);


/**
 * Returns {@link True} if the stack equals the limit.
 * @param { number } limit
 * @returns churchBoolean
 * @private
 */
const full = limit =>
  limit === jsNum(size(logObservable.getValue())) ? True: False;

/**
 * Appends the given message to the stack.
 * If the stack size equals the param limit, the stack will be evicted using the defined eviction strategy.
 * @type {
 *        (type: PrioritySupplier) =>
 *        (msg: String) =>
 *        (limit: Number) =>
 *        (evictionStrategy: UnaryOperation.<IObservable.<stack>>) =>
 *        churchBoolean
 * }
 */
const append = type => msg => limit => evictionStrategy => {
  // evict the stack using the given evictionStrategy
  logObservable = evictionStrategy(logObservable);
  LazyIf(full(limit))
    (Then(() => {
      // if the stack is full, despite using the set eviction strategy, use the default eviction strategy to make space.
      logObservable = DEFAULT_CACHE_EVICTION_STRATEGY(logObservable);
      logObservable.setValue(createNewStack(LOG_ERROR)(OVERFLOW_LOG_MESSAGE));
      logObservable.setValue(createNewStack(type)(msg));
    }))
    (Else(() => logObservable.setValue(createNewStack(type)(msg))));
  return True;
};

/**
 * creates a new stack on top of the observable-stack
 * @type {
 *   (type: PrioritySupplier) =>
 *   (msg: String) =>
 *   stack
 * }
 */
const createNewStack = type => msg =>
  push(logObservable.getValue())(Pair(type)(msg));