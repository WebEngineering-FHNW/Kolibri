import { addToTestingTable, TESTS }           from "../../util/testingTable.js";
import { TestSuite }                          from "../../../util/test.js";
import {nil, append, forever, Sequence, take} from "../../sequence.js";
import { createTestConfig }                   from "../../util/testUtil.js";
import { count$ }                             from "./count.js";
import {id}                                   from "../../../stdlib.js";

const testSuite = TestSuite("Sequence: terminal operation count$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "count$",
    iterable:  () => nil,
    operation: () => count$,
    evalFn:    expected => actual => expected === actual,
    expected:  0,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE],
    invariants: [
        it => count$(it) * 2 === count$(append(it)(it)),
    ]
  })
);

testSuite.add("zero, one, many", assert => {
    assert.is(count$(nil),  0);
    assert.is(count$([42]), 1);
    assert.is(count$(Array.from({length: 1000})), 1000);
});

testSuite.add("take and then count", assert => {
    const infinite = Sequence(0, forever, id);  // this cannot be counted
    assert.is(count$( take(10)(infinite) ), 10); // take with upper limit
    assert.is(count$( take(10)( nil)     ),  0); // upper limit does not get in the way if iterable is shorter
});

testSuite.run();
