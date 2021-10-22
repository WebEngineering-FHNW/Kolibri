import {TestSuite} from "../../test/test.js";

import {id, c}     from "./stdlib.js";

const stdlibSuite = TestSuite("Standard Lib");

stdlibSuite.add("id", assert => {
    assert.is(id(id), id);
    assert.is(id(1), 1);
    assert.is(id(true), true);
    assert.is(id === id, true);
});

stdlibSuite.add("c (konst)", assert => {
    assert.is(c(1)(undefined), 1);
    // test the caching
    let x = 0;
    const getX = c(x); // value of x is evaluated and cached here
    x++;
    assert.is(x, 1);
    assert.is(getX(), 0);
});

stdlibSuite.report();
