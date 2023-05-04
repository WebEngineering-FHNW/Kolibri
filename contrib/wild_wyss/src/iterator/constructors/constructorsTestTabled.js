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
  ConcatIterator,
  StackIterator,
  emptyIterator,
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
  newIterator,
  testCopy,
  testCopyAfterConsumption,
  testSimple,
} from "../util/testUtil.js";

const iteratorSuite = TestSuite("Iterator Table"); // TODO: remove from allTests

const prepareTestSuite = () => {
  [
    iteratorConfig,
    arrayIteratorConfig,
    tupleIteratorConfig,
    concatIteratorConfig,
    stackIteratorConfig,
    emptyIteratorConfig,
    pureIteratorConfig,
    replicateConfig,
    fibonacciIteratorConfig,
    angleIteratorConfig,
    squareNumberIteratorConfig,
    primeNumberIteratorConfig,
    repeatConfig,
  ].forEach(config => {
    iteratorSuite.add(`test simple: ${config.name}`,                 testSimple              (config));
    iteratorSuite.add(`test copy: ${config.name}`,                   testCopy                (config));
    iteratorSuite.add(`test copy after consumption: ${config.name}`, testCopyAfterConsumption(config));
  })
};

const iteratorConfig = createTestConfig({
  name:      "Iterator",
  iterator:  () => Iterator(0, current => current + 1, current => 4 < current),
  expected:  [0,1,2,3,4],
});

const arrayIteratorConfig = createTestConfig({
  name:      "ArrayIterator",
  iterator:  () => ArrayIterator([0,1,2,3,4]),
  expected:  [0,1,2,3,4],
});

const tupleIteratorConfig = createTestConfig({
  name:      "TupleIterator",
  iterator:  () => {
    const [ Triple ]    = Tuple(5);
    const triple        = Triple(0)(1)(2)(3)(4);
    return TupleIterator(triple)
  },
  expected:  [0,1,2,3,4],
});

const concatIteratorConfig = createTestConfig({
  name:      "ConcatIterator",
  iterator:  () => {
    const it1 = newIterator(2);
    const it2 = Range(3,4);
    return ConcatIterator(it1)(it2);
  },
  expected:  [0,1,2,3,4],
});

const stackIteratorConfig = createTestConfig({
  name:     "StackIterator",
  iterator: () => {
    const stack = reverseStack(convertArrayToStack([0,1,2,3,4]));
    return StackIterator(stack);
  },
  expected: [0,1,2,3,4],
});

const emptyIteratorConfig = createTestConfig({
  name:     "EmptyIterator",
  iterator: () => emptyIterator,
  expected: [],
});

const pureIteratorConfig = createTestConfig({
  name:     "PureIterator",
  iterator: () => PureIterator(42),
  expected: [42],
});

const replicateConfig = createTestConfig({
  name:     "replicate",
  iterator: () => replicate(3)(true),
  expected: [true, true, true],
});

const fibonacciIteratorConfig = createTestConfig({
  name:     "FibonacciIterator",
  iterator: () => FibonacciIterator(),
  expected: [1, 1, 2, 3, 5, 8],
  evalFn:   expected => actual => {
    const expectedArray = takeWithoutCopy(5)(expected);
    const actualArray   = takeWithoutCopy(5)(actual);
    return arrayEq(expectedArray)(actualArray);
  }
});

const angleIteratorConfig = createTestConfig({
  name:     "AngleIterator",
  iterator: () => AngleIterator(4),
  expected: [0, 90, 180, 270],
});

const squareNumberIteratorConfig = createTestConfig({
  name:     "SquareNumberIterator",
  iterator: () => SquareNumberIterator(),
  expected: [1, 4, 9, 16, 25],
  evalFn:   expected => actual => {
    const expectedArray = takeWithoutCopy(5)(expected);
    const actualArray   = takeWithoutCopy(5)(actual);
    return arrayEq(expectedArray)(actualArray);
  }
});

const primeNumberIteratorConfig = createTestConfig({
  name:     "PrimeNumberIterator",
  iterator: () => PrimeNumberIterator(),
  expected: [2, 3, 5, 7, 11],
  evalFn:   expected => actual => {
    const expectedArray = takeWithoutCopy(5)(expected);
    const actualArray   = takeWithoutCopy(5)(actual);
    return arrayEq(expectedArray)(actualArray);
  }
});

const repeatConfig = createTestConfig({
  name:     "repeat",
  iterator: () => repeat(42),
  expected: [42, 42, 42, 42, 42],
  evalFn:   expected => actual => {
   const expectedArray = takeWithoutCopy(5)(expected);
   const actualArray   = takeWithoutCopy(5)(actual);
   return arrayEq(expectedArray)(actualArray);
  }
});

prepareTestSuite();
iteratorSuite.run();