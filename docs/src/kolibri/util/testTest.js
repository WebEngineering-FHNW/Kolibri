
// Testing special functions in the test facility itself.

import { TestSuite } from "./test.js";
import { Range }     from "../sequence/constructors/range/range.js"

const testSuite = TestSuite("util/test");

testSuite.add("iterableEq pass", assert => {
     assert.iterableEq([],          []);             // empty iterables
     assert.iterableEq([1],         [1]);            // single valued iterables
     assert.iterableEq([1,2,3,4],   [1,2,3,4]);      // any iterable
     assert.iterableEq(Range(1,4),  [1,2,3,4]);      // any iterable
});

// uncomment the test below to see how it fails and how errors are logged and reported
/*
testSuite.add("iterableEq fail", assert => {
     assert.iterableEq([1,2],      [1,2,3]);         // actual is shorter
     assert.iterableEq([1,2,3],    [1,2]);           // expected is shorter
     assert.iterableEq([2,2,3,4],  [1,2,3,4]);       // first element different
     assert.iterableEq([1,2,3,4],  [1,2,4,4]);       // any element different
     assert.iterableEq([1,2,3,4],  [1,2,3,5]);       // last element different
     assert.iterableEq(Range(100), Range(50),  100); // actual has more elements than default
     assert.iterableEq(Range(50),  Range(100), 100); // expected has more elements than default
     assert.iterableEq(Range(100), Range(80),   80); // after 80, comparing will be aborted
     assert.iterableEq(Range(80),  Range(100),  80); // after 80, comparing will be aborted
});
*/

testSuite.run();
