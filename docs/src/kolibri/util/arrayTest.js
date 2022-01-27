// noinspection PointlessArithmeticExpressionJS

import {TestSuite} from "./test.js";
import "./array.js";

const arraySuite = TestSuite("util/array");

arraySuite.add("eq", assert => {
    assert.is( [].eq([]),       true);
    assert.is( [1].eq([1]),     true);
    assert.is( [1].eq([]),      false);
    assert.is( [].eq([1]),      false);
    assert.is( [0].eq(["0"]),   false);
    assert.is( [arraySuite.add].eq([arraySuite.add]), true); // test function reference (no stringify possible)
});

arraySuite.add("remove", assert => {
    let abc = Array.from("abc");
    let result = abc.removeAt(0);
    assert.is(result.eq(["a"]),  true);  // returns the removed result in an array
    assert.is(abc.eq(["b","c"]), true);  // removal modifies the receiver

    abc = Array.from("abc");
    result = abc.removeAt(42);               // unknown index is ignored
    assert.is(result.eq([]),  true);         // nothing removed
    assert.is(abc.eq(["a","b","c"]), true);  // receiver remains unmodified

    abc = Array.from("aba");
    result = abc.removeItem("a");
    assert.is(result.eq(["a"]),  true);
    assert.is(abc.eq(["b","a"]), true);      // only the first found item is removed

    abc = Array.from("abc");
    result = abc.removeItem("not found");
    assert.is(result.eq([]),  true);
    assert.is(abc.eq(["a","b","c"]), true);

});

arraySuite.add("times", assert => {
    assert.is(  (0).times().eq([]),     true);
    assert.is( (-1).times().eq([]),     true);
    assert.is( ( 1).times().eq([0]),    true);
    assert.is( (10).times().eq([0,1,2,3,4,5,6,7,8,9]), true);
    assert.is(  (5).times(x=>x*x).eq([0,1,4,9,16]), true);
    let counter = 0;
    "5".times( _ => counter++); // also works from strings. Mapping can side-effect.
    assert.is(counter, 5);
    try {
        "isNoNumber".times();
        assert.is(true,false); // must not reach here
    } catch (e) {
        assert.is(e instanceof TypeError, true);
    }
});

arraySuite.add("sum", assert => {
    assert.is( [].sum(), 0);
    assert.is( [1].sum(), 1);
    assert.is( ["1"].sum(), 1);
    assert.is( (10).times().sum(), 9 * 10 / 2);
    assert.is( [1].sum(Number), 1);
    assert.is( ["1"].sum(Number), 1);
    assert.is( (10).times().sum(Number), 9 * 10 / 2);
    assert.is( (3).times().sum(n => n*n), 0 + 1 + 4);
});

arraySuite.run();
