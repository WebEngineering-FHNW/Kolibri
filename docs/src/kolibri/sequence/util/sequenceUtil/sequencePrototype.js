// noinspection GrazieInspection

import { bind }         from "../../operators/bind/bind.js";
import { map }          from "../../operators/map/map.js";
import { pipe }         from "../../operators/pipe/pipe.js";
import { show }         from "../../terminalOperations/show/show.js";
import { eq$ }          from "../../terminalOperations/eq/eq.js";
import { PureSequence } from "../../constructors/pureSequence/pureSequence.js";
import { isIterable }   from "./isIterable.js";
import { cons }         from "../../operators/cons/cons.js";
import {LoggerFactory}  from "../../../logger/loggerFactory.js";
import {catMaybes}      from "../../../stdlib/stdlib.js";

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

SequencePrototype.cons = function (element) {
  return cons(element)(this);
};

SequencePrototype.catMaybes = function () {
  return catMaybes(this);
};
