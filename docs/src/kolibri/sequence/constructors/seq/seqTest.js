import { TestSuite }                from "../../../util/test.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { Seq }                      from "./seq.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { nil }                      from "../nil/nil.js";
import { isEmpty }                  from "../../terminalOperations/isEmpty/isEmpty.js";

const testSuite = TestSuite("Sequence: constructor seq");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "Seq",
    iterable: () => Seq(1, 2, 3),
    expected: [1,2,3],
    excludedTests: [
      TESTS.TEST_PURITY,                    // makes no sense for constructors
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,  // has no callback
    ]
  })
);

testSuite.add("constructors", assert => {
    assert.is(isEmpty(Seq()),               true);
    assert.is(isEmpty(Seq(1)),              false);
    assert.iterableEq(Seq(),                nil);
    assert.iterableEq(Seq(),                Seq());
    assert.iterableEq(Seq(1),               Seq(1));
    assert.iterableEq(Seq(1, 2, 3),         Seq(1, 2, 3));
    assert.iterableEq(Seq(1, 2, 3),         [1, 2, 3]);
    assert.iterableEq(Seq(...[1, 2, 3]),    [1, 2, 3]);
});

testSuite.add("defensive copy", assert => {
    const array = [1,2,3];
    const nums = Seq(...array);
    array.push(4);           // although the array is mutated, the sequence is not
    assert.iterableEq(array, [1,2,3,4]);
    assert.iterableEq(nums,  [1,2,3]);
});

testSuite.run();
