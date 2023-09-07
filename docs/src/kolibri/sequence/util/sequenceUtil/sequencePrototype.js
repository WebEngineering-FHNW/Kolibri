// noinspection GrazieInspection

import { PureSequence }  from "../../constructors/pureSequence/pureSequence.js";
import { isIterable }    from "./isIterable.js";
import { LoggerFactory } from "../../../logger/loggerFactory.js";
import {
  append,
  bind,
  catMaybes,
  cons,
  cycle,
  drop,
  dropWhile,
  map,
  pipe,
  take
} from "../../operators/operators.js";
import {
  eq$,
  show
} from "../../terminalOperations/terminalOperations.js";

const log = LoggerFactory("kolibri.sequence");

export { SequencePrototype }
/**
 * This function serves as prototype for the {@link SequenceType}.
 *
 */
const SequencePrototype = () => null;


SequencePrototype.and = function (bindFn) {
  return bind(bindFn)(this);
};

SequencePrototype.fmap = function (mapper) {
  return map(mapper)(this);
};

SequencePrototype.pure = val => PureSequence(val);

SequencePrototype.empty = () => {
  const emptySequence = () => {
    const iterator = () => {
      const next = () => ({ done: true, value: undefined });
      return { next };
    };

    return {[Symbol.iterator]: iterator};
  };

  const nil = emptySequence();
  Object.setPrototypeOf(nil, SequencePrototype);

  return /** @type SequenceType */ nil;
};

SequencePrototype.show = function (maxValues = 50) {
  return show(this, maxValues);
};

SequencePrototype.toString = function (maxValues = 50) {
  if (maxValues !== 50) {
    log.warn("Sequence.toString() with maxValues might lead to type inspection issues. Use show("+ maxValues+") instead.");
  }
  return show(this, maxValues);
};
SequencePrototype.pipe = function(...transformers) {
  return pipe(...transformers)(this);
};

SequencePrototype.eq$ = function(that) {
  if (!isIterable(that)) return false;
  return eq$(this) /* == */ (that);
};

SequencePrototype["=="] = SequencePrototype.eq$;

// all the SequenceOperations are added to the prototype

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

SequencePrototype.dropWhile = function (predicate) {
  return dropWhile(predicate)(this);
};

SequencePrototype.take = function (n) {
  return take(n)(this);
};

SequencePrototype.map = SequencePrototype.fmap;
