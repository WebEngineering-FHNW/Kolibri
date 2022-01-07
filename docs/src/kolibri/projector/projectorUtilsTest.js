import { TestSuite } from "../util/test.js";

import { timeStringToMinutes, totalMinutesToTimeString } from "./projectorUtils.js"

const projectorUtilsSuite = TestSuite("projectorUtils");

projectorUtilsSuite.add("string2time", assert => {
    assert.is(timeStringToMinutes(""), 0);
    assert.is(timeStringToMinutes("just wrong"), 0);
    assert.is(timeStringToMinutes("00:00"), 0);
    assert.is(timeStringToMinutes("00:01"), 1);
    assert.is(timeStringToMinutes("00:11"), 11);
    assert.is(timeStringToMinutes("01:11"), 71);
    assert.is(timeStringToMinutes("11:11"), 11 * 60 + 11);
    assert.is(timeStringToMinutes("23:59"), 23 * 60 + 59);
});

projectorUtilsSuite.add("time2string", assert => {
    assert.is(totalMinutesToTimeString(0), "00:00");
    assert.is(totalMinutesToTimeString(5 * 8 * 60), "40:00"); // can be total hours in a week
});

projectorUtilsSuite.add("invariant", assert => {
    const str2timeAndBack = str => str === totalMinutesToTimeString(timeStringToMinutes(str));
    assert.is(str2timeAndBack("00:00"), true);
    assert.is(str2timeAndBack("00:01"), true);
    assert.is(str2timeAndBack("00:11"), true);
    assert.is(str2timeAndBack("01:11"), true);
    assert.is(str2timeAndBack("11:11"), true);
    assert.is(str2timeAndBack("23:59"), true);
    assert.is(str2timeAndBack("99:59"), true);
    assert.is(str2timeAndBack("99:99"), false);
    assert.is(str2timeAndBack(""),      false);
});

projectorUtilsSuite.run();
