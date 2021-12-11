import { TestSuite } from "./test.js";
import { arrayEq, removeItem, removeAt, times, sum } from "./array.js";

const arraySuite = TestSuite("util/array");

arraySuite.add("eq", assert => {
    assert.is( arrayEq([])([]),       true);
    assert.is( arrayEq([1])([1]),     true);
    assert.is( arrayEq([1])([]),      false);
    assert.is( arrayEq([])([1]),      false);
    assert.is( arrayEq([0])(["0"]),   false);
    assert.is( arrayEq([arraySuite.add])([arraySuite.add]), true); // test function reference (no stringify possible)
});

arraySuite.add("remove", assert => {
    let abc = Array.from("abc");
    let result = removeAt(abc)(0);
    assert.is(arrayEq(result) (["a"]),  true);  // returns the removed result in an array
    assert.is(arrayEq(abc) (["b","c"]), true);  // removal modifies the receiver

    abc = Array.from("abc");
    result = removeAt(abc) (42);               // unknown index is ignored
    assert.is(arrayEq(result) ([]),  true);         // nothing removed
    assert.is(arrayEq(abc) (["a","b","c"]), true);  // receiver remains unmodified

    abc = Array.from("aba");
    result = removeItem(abc) ("a");
    assert.is(arrayEq(result) (["a"]),  true);
    assert.is(arrayEq(abc) (["b","a"]), true);      // only the first found item is removed

    abc = Array.from("abc");
    result = removeItem(abc) ("not found");
    assert.is(arrayEq(result) ([]),  true);
    assert.is(arrayEq(abc) (["a","b","c"]), true);

});

arraySuite.add("times", assert => {
    assert.is( arrayEq (times( 0)()) ([]),     true);
    assert.is( arrayEq (times(-1)()) ([]),     true);
    assert.is( arrayEq (times( 1)()) ([0]),    true);
    assert.is( arrayEq (times(10)()) ([0,1,2,3,4,5,6,7,8,9]), true);
    assert.is( arrayEq (times( 5)(x=>x*x)) ([0,1,4,9,16]), true);
});

arraySuite.add("sum", assert => {
    assert.is( sum([])(), 0);
    assert.is( sum([1])(), 1);
    assert.is( sum(["1"])(), 1);
    assert.is( sum(times(10)())(), 9 * 10 / 2);
    assert.is( sum([1])(Number), 1);
    assert.is( sum(["1"])(Number), 1);
    assert.is( sum(times(10)())(Number), 9 * 10 / 2);
    assert.is( sum(times(3)()) (n => n*n), 0 + 1 + 4);
});

arraySuite.run();
