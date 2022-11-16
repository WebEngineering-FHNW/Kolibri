import { Range } from "./range.js"
import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";

const loggerSuite = TestSuite("Range");


const testRange = (from, to, step, range, assert) => {

  for (let expected = from; expected <= to; expected += step) {
    const { done, value } = range.next();
    assert.is(value, expected);
    assert.isTrue(!done)
  }
  assert.isTrue(range.next().done)
};

const testRangeNegativeStepSize = (from, to, step, range, assert) => {
  for (let expected = from; expected >= to; expected += step) {
    const { done, value } = range.next();
    assert.is(value, expected);
    assert.isTrue(!done)
  }
  assert.isTrue(range.next().done)
};

loggerSuite.add("test simple Range(3)", assert => {
  testRange(0, 3, 1, Range(3), assert)
});

loggerSuite.add("test simple Range(2,3)", assert => {
  testRange(2, 3, 1, Range(2,3), assert)
});

loggerSuite.add("test simple Range(3,2,1)", assert => {
  testRange(2, 3, 1, Range(3,2,1), assert)
});

loggerSuite.add("test break Range(7)", assert => {
  const range = Range(7);

  for (const value of range) {
    assert.is(value, 0);
    break;
  }
  assert.isTrue(range.next().done)
});

loggerSuite.add("test use range twice", assert => {
  const range = Range(0);

  const [zero] = range;
  assert.is(zero, 0);

  const [repeat] = range;
  assert.is(repeat, undefined)
});

loggerSuite.add("test use range twice", assert => {
  for (const value of Range(10)) {
    if(4 > value) continue;
    if(4 < value) break;
    assert.is(value, 4);
  }
});

loggerSuite.add("test negative Range(4,6,-2)", assert =>
  testRangeNegativeStepSize(6, 4, -2, Range(4, 6, -2), assert));

loggerSuite.add("test negative Range(6,4,-2)", assert =>
  testRangeNegativeStepSize(6, 2, -2, Range(6, 2, -2), assert));

loggerSuite.add("test negative Range(0, -2, -1)", assert =>
  testRangeNegativeStepSize(0, -2, -1, Range(0, -2, -1), assert));

loggerSuite.run();

// negRange.forEach(console.log); // forEach does not exist on JS Iterator until now
// negRange.forEach(console.log); // never shown
