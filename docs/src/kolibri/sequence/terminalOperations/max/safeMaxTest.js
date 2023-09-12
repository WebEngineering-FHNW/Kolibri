import { addToTestingTable, TESTS }             from "../../util/testingTable.js";
import { TestSuite }                            from "../../../util/test.js";
import { Just }                                 from "../../../lambda/maybe.js";
import {PureSequence, replicate, safeMax$, nil} from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                               from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation safeMax$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "safeMax$",
    iterable:  () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation: () => safeMax$,
    expected:  Just(4),
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
  const maybeMax = safeMax$(single);

  // Then
  maybeMax
    (_ => assert.isTrue(false))
    (x => assert.is(x, 1));
});

testSuite.add("test empty sequence: should return Nothing", assert => {
  // When
  const maybeMax = safeMax$(nil);

  // Then
  maybeMax
    (_ => assert.isTrue(true))
    (_ => assert.isTrue(false));
});

testSuite.add("test comparator on strings: should return the longest string", assert => {
  // Given
  const strings  = ["a", "b", "aa", "bb"];

  // When
  const maybeMax = safeMax$(strings, (a, b) => a.length < b.length);

  // Then
  maybeMax
    (_ => assert.isTrue(false))
    (x => assert.is(x, "aa"));
});

testSuite.add("test largest element at the end of the iterable", assert => {
  // Given
  const sequence = [4,3,2,5,1,0,9];

  // When
  const maybeMax = safeMax$(sequence);

  // Then
  maybeMax
    (_ => assert.isTrue(false))
    (x => assert.is(x, 9));
});

testSuite.add("test largest element at the start of the iterable", assert => {
  // Given
  const sequence = [9,4,3,2,5,1,0];

  // When
  const maybeMax = safeMax$(sequence);

  // Then
  maybeMax
    (_ => assert.isTrue(false))
    (x => assert.is(x, 9));
});

testSuite.add("test multiple of equal values", assert => {
  // Given
  const values   = replicate(4)(7);

  // When
  const maybeMax = safeMax$(values);

  // Then
  maybeMax
    (_ => assert.isTrue(false))
    (x => assert.is(x, 7));
});

testSuite.run();
