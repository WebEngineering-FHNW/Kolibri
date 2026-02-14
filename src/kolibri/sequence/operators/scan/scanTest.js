import {addToTestingTable} from "../../util/testingTable.js";
import {TestSuite}         from "../../../util/test.js";
import {scan}              from "./scan.js";
import {
    createTestConfig,
    newSequence,
    UPPER_SEQUENCE_BOUNDARY,
}                          from "../../util/testUtil.js";
import {Seq}               from "../../constructors/seq/seq.js";
import {plusOp}            from "../../util/helpers.js";
import {nil}               from "../../constructors/nil/nil.js";

const testSuite = TestSuite("Sequence: operation scan");

addToTestingTable(testSuite)(
    createTestConfig({
         name:          "scan",
         iterable:      () => newSequence(UPPER_SEQUENCE_BOUNDARY),
         operation:     () => scan(plusOp,0),                // partial numerical sum
         expected:      [0, 1, 3, 6, 10],                    // triangle numbers
         invariants: [
             seq => scan((acc, cur) => cur,0)(seq) ["=="] (seq), // scan with identity makes no difference
             (_) => scan(plusOp,0)(nil)            ["=="] (nil), // no matter the op, scan of nil is nil
         ],
     })
);

testSuite.add("scan for counting (partial sums) with eta reduction", assert => {
    const partialSum = scan(plusOp,0); // seq is eta reduced
    const result     = partialSum(Seq(1, 1, 1, 1, 1));
    assert.iterableEq(result, Seq(1, 2, 3, 4, 5));
    // and again just to make sure there is no spill-over effect in the binding
    const result2 = partialSum(Seq(1, 1, 1, 1, 1));
    assert.iterableEq(result2, Seq(1, 2, 3, 4, 5));

});

testSuite.add("scan for triangular nums", assert => {
    const result = scan(plusOp,0)(Seq(1, 2, 3, 4, 5));
    assert.iterableEq(result, Seq(1, 3, 6, 10, 15));
});

testSuite.add("scan for triangular nums keep reference", assert => {
    const result = scan(plusOp,0)(Seq(1, 2, 3, 4, 5));
    assert.iterableEq(result, Seq(1, 3, 6, 10, 15));
    assert.iterableEq(result, Seq(1, 3, 6, 10, 15));
});

testSuite.run();
