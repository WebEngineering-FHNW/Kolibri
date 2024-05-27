import { addToTestingTable, TESTS }               from "../../util/testingTable.js";
import { TestSuite }                              from "../../../util/test.js";
import { Just }                                   from "../../../lambda/maybe.js";
import { PureSequence, replicate, nil, safeMin$ } from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                                 from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation safeMin$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "safeMin$",
    iterable:  () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation: () => safeMin$,
    expected:  Just(0),
    evalFn:    expected => actual => {
      let unwrappedVal;
      expected(_ => {})(x => unwrappedVal = x);

      let result = false;
      actual
        (_ => false)
        (x => result = x === unwrappedVal);
      return result;
    },
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test single element: should return the only element ", assert => {
  // Given
  const single   = PureSequence(1);

  // When
  const maybeMin = safeMin$(single);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 1));
});

testSuite.add("test empty sequence: should return Nothing", assert => {
  // When
  const maybeMin = safeMin$(nil);

  // Then
  maybeMin
  (_ => assert.isTrue(true))
  (_ => assert.isTrue(false));
});

testSuite.add("test comparator on strings: should return the longest string", assert => {
  // Given
  const strings  = ["a", "aa"];

  // When
  const maybeMin = safeMin$(strings, (a, b) => a.length < b.length);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, "a"));
});

testSuite.add("test smallest element at the end of the iterable", assert => {
  // Given
  const sequence = [4,3,2,5,1,9,0];

  // When
  const maybeMin = safeMin$(sequence);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 0));
});

testSuite.add("test smallest element at the start of the sequence", assert => {
  // Given
  const sequence = [0,9,4,3,2,5,1];

  // When
  const maybeMin = safeMin$(sequence);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 0));
});

testSuite.add("test multiple of equal values", assert => {
  // Given
  const values  = replicate(4)(7);

  // When
  const maybeMin = safeMin$(values);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 7));
});

testSuite.run();
