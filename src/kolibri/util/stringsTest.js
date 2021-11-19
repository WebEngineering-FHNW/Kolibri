import { padLeft, padRight }    from "./strings.js";
import { TestSuite }            from "./test.js"

const stringSuite = TestSuite("util-string");

stringSuite.add("padLeft", assert => {
    assert.is(padLeft("a",2), " a");
    assert.is(padLeft("a",1), "a");
    assert.is(padLeft("a",0), "a");
});

stringSuite.add("padRight", assert => {
    assert.is(padRight("a",2), "a ");
    assert.is(padRight("a",1), "a");
    assert.is(padRight("a",0), "a");

});

stringSuite.run();
