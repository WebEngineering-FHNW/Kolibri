import { TestSuite }                from "../../../util/test.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { seq }                      from "./seqSequence.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import {nil}                        from "../nil/nil.js";
import {isEmpty}                    from "../../terminalOperations/isEmpty/isEmpty.js";

const testSuite = TestSuite("Sequence: constructor seq");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "seq Sequence",
    iterable: () => seq(1,2,3),
    expected: [1,2,3],
    excludedTests: [
      TESTS.TEST_PURITY,                    // makes no sense for ctors
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,  // has no callback
    ]
  })
);

testSuite.add("ctors", assert => {
    assert.is(isEmpty(seq()), true);
    assert.is(isEmpty(seq(1)), false);
    assert.iterableEq(seq(), nil);
    assert.iterableEq(seq(), seq());
    assert.iterableEq(seq(1), seq(1));
    assert.iterableEq(seq(1,2,3), seq(1,2,3));
    assert.iterableEq(seq(1,2,3), [1,2,3]);
    assert.iterableEq(seq(...[1,2,3]), [1,2,3]);
});

testSuite.add("defensive copy", assert => {
    const array = [1,2,3];
    const nums = seq(...array);
    array.push(4);
    assert.iterableEq(array, [1,2,3,4]);
    assert.iterableEq(nums,  [1,2,3]);
});

testSuite.run();
