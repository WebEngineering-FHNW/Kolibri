import { TestSuite } from "../../../util/test.js";
import { unfold }    from "./unfold.js";
import { Seq }       from "../seq/seq.js";
import { Range }     from "../range/range.js";
import { nil }       from "../nil/nil.js";

const testSuite = TestSuite("Sequence: constructor unfold");

testSuite.add("common usage", assert => {

    const empty = unfold(undefined, _ => undefined);
    assert.iterableEq(empty, nil);

    const zeroToFour = unfold(0, n => n < 5 ? {state: n + 1, value: n} : undefined);
    assert.iterableEq(zeroToFour, Range(4));

    const infiniteFibs = unfold(
        {last: 0, current: 1},
        ( {last, current}) => ({ state: {last: current, current: last + current}, value: last })
    );
    assert.iterableEq(infiniteFibs.take(10), Seq(0, 1, 1, 2, 3, 5, 8, 13, 21, 34));

});

testSuite.run();
