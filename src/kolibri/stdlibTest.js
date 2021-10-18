import {TestSuite} from "../../test/test.js";

import {id} from "./stdlib.js";

const stdlibSuite = TestSuite("Standard Lib");

stdlibSuite.add("identity", assert => {
    assert.is(id(id), id);
    assert.is(id(1), 1);
    assert.is(id(true), true);
    assert.is(id === id, true);
});

stdlibSuite.report();
