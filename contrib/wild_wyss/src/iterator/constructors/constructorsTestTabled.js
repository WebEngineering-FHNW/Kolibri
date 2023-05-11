import { TestSuite }       from "../../test/test.js";
import { Tuple }           from "../../../../../docs/src/kolibri/stdlib.js";
import { Range }           from "../../range/range.js";
import { takeWithoutCopy } from "../util/util.js";
import { arrayEq }         from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  convertArrayToStack,
  reverseStack
} from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";

import {
  Iterator,
  ArrayIterator,
  TupleIterator,
  StackIterator,
  nil,
  PureIterator,
  FibonacciIterator,
  AngleIterator,
  SquareNumberIterator,
  PrimeNumberIterator,
  repeat,
  replicate,
} from "../iterator.js"

import {
  createTestConfig,
  testCopy,
  testCopyAfterConsumption,
  testSimple,
} from "../util/testUtil.js";

const iteratorSuite = TestSuite("Iterator Table"); // TODO: remove from allTests

const prepareTestSuite = () => {
  [

  ].forEach(config => {
    iteratorSuite.add(`test simple: ${config.name}`,                 testSimple              (config));
    iteratorSuite.add(`test copy: ${config.name}`,                   testCopy                (config));
    iteratorSuite.add(`test copy after consumption: ${config.name}`, testCopyAfterConsumption(config));
  })
};




prepareTestSuite();
iteratorSuite.run();