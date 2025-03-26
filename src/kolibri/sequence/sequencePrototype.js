// noinspection GrazieInspection

import {PureSequence}             from "./constructors/pureSequence/pureSequence.js";
import {
  LoggerFactory
}                                 from "../logger/loggerFactory.js";
import {
  nil
}                                 from "./constructors/nil/nil.js";
import {
  append,
  bind,
  catMaybes,
  cons,
  cycle,
  drop,
  dropWhere,
  dropWhile,
  map,
  mconcat,
  pipe,
  reverse$,
  snoc,
  take,
  takeWhere,
  takeWhile,
  tap,
  zip,
  zipWith
}                                 from "./operators/operators.js";
import {
  count$,
  eq$,
  foldr$,
  foldl$,
  head,
  isEmpty,
  max$,
  min$,
  reduce$,
  safeMax$,
  safeMin$,
  show,
  uncons
}                                 from "./terminalOperations/terminalOperations.js";
import {
  forEach$
}                                 from "./terminalOperations/forEach/forEach.js";
import {isIterable}               from "./util/helpers.js";
import {LOG_CONTEXT_KOLIBRI_BASE} from "../logger/logConstants.js";


export { SequencePrototype, createMonadicSequence, LOG_CONTEXT_KOLIBRI_SEQUENCE }

const LOG_CONTEXT_KOLIBRI_SEQUENCE = LOG_CONTEXT_KOLIBRI_BASE+".sequence";
const log = LoggerFactory(LOG_CONTEXT_KOLIBRI_SEQUENCE);
/**
 * This function object serves as prototype for the {@link SequenceType}.
 * Singleton object.
 */
function SequencePrototype () {  } // does nothing on purpose

/**
 *
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns { SequenceType<_T_> }
 */
function setPrototype (iterable) {
  Object.setPrototypeOf(iterable, SequencePrototype);
  return /**@type SequenceType*/ iterable;
}

/**
 * Builds an {@link SequenceType} by decorating a given {@link Iterator}.
 * @template _T_
 * @param { () => Iterator<_T_> } iteratorConstructor - a function that returns an {@link Iterator}
 * @returns { SequenceType<_T_> }
 */
function createMonadicSequence (iteratorConstructor) {
  const iterable = { [Symbol.iterator]: iteratorConstructor }; // make a new iterable object
  return setPrototype(iterable);
}

// monadic sequence operations ----------------------------------

SequencePrototype.and = function (bindFn) {
  return bind(bindFn)(this);
};

SequencePrototype.fmap = function (mapper) {
  return map(mapper)(this);
};

SequencePrototype.pure = val => PureSequence(val);

SequencePrototype.empty = () => nil;

// terminal sequence operations ----------------------------------

SequencePrototype.show = function (maxValues = 50) {
  return show(this, maxValues);
};

SequencePrototype.toString = function (maxValues = 50) {
  if (maxValues !== 50) {
    log.warn("Sequence.toString() with maxValues might lead to type inspection issues. Use show("+ maxValues+") instead.");
  }
  return show(this, maxValues);
};

SequencePrototype.count$ = function() {
  return count$(this);
};

SequencePrototype.eq$ = function(that) {
  if (!isIterable(that)) return false;
  return eq$(this) /* == */ (that);
};

SequencePrototype["=="] = SequencePrototype.eq$;

SequencePrototype.foldr$ = function(callback, start) {
    return foldr$(callback, start)(this);
};

SequencePrototype.foldl$ = function(callback, start) {
    return foldl$(callback, start)(this);
};

SequencePrototype.forEach$ = function(callback) {
    return forEach$(callback)(this);
};

SequencePrototype.head = function() {
    return head(this);
};

SequencePrototype.isEmpty = function() {
    return isEmpty(this);
};

SequencePrototype.max$ = function(comparator = (a, b) => a < b) {
    return max$(this, comparator);
};

SequencePrototype.safeMax$ = function(comparator = (a, b) => a < b) {
    return safeMax$(this, comparator);
};

SequencePrototype.min$ = function(comparator = (a, b) => a < b) {
    return min$(this, comparator);
};

SequencePrototype.safeMin$ = function(comparator = (a, b) => a < b) {
    return safeMin$(this, comparator);
};

SequencePrototype.reduce$ = function(callback, start) {
    return reduce$(callback, start)(this);
};

SequencePrototype.uncons = function() {
    return uncons(this);
};

// "semigroup-like" sequence operations -------------------------------------

SequencePrototype.append = function (sequence) {
  return append(this)(sequence);
};
SequencePrototype["++"] = SequencePrototype.append;

SequencePrototype.catMaybes = function () {
  return catMaybes(this);
};

SequencePrototype.cons = function (element) {
  return cons(element)(this);
};

SequencePrototype.cycle = function () {
  return cycle(this);
};

SequencePrototype.drop = function (n) {
  return drop(n)(this);
};

SequencePrototype.dropWhere = function (predicate) {
    return dropWhere(predicate)(this);
};

SequencePrototype.dropWhile = function (predicate) {
  return dropWhile(predicate)(this);
};

SequencePrototype.tap = function (callback) {
  return tap(callback)(this);
};

SequencePrototype.map = SequencePrototype.fmap;

SequencePrototype.mconcat = function () {
  return mconcat(this);
};

SequencePrototype.pipe = function(...transformers) {
  return pipe(...transformers)(this);
};

SequencePrototype.reverse$ = function () {
  return reverse$(this);
};

SequencePrototype.snoc = function (element) {
  return snoc(element)(this);
};

SequencePrototype.take = function (n) {
  return take(n)(this);
};

SequencePrototype.takeWhere = function (predicate) {
  return takeWhere(predicate)(this);
};

SequencePrototype.takeWhile = function (predicate) {
  return takeWhile(predicate)(this);
};

SequencePrototype.zip = function (iterable) {
  return zip(this)(iterable);
};

SequencePrototype.zipWith = function (zipFn) {
  return zipWith(zipFn)(this);
};

