import { TestSuite }                          from "./test.js";
import { withDebugTestArrayAppender }         from "../logger/loggerTest.js";
import { setLoggingLevel, setLoggingContext } from "../logger/logging.js";
import { LOG_WARN }                           from "../logger/logLevel.js";
import { dom, fireChangeEvent, select }       from "./dom.js";

const domSuite = TestSuite("util/dom");

domSuite.add("dom", assert => {
    const [resultElement] = dom('<section></section>');
    assert.is( resultElement instanceof HTMLElement, true);
});

domSuite.add("fire-event", assert => {
    const [inputElement] = dom('<input type="text" value="old"/>');
    let value = "";
    inputElement.onchange = _ => value = inputElement.value;
    assert.is(value,"");
    fireChangeEvent(inputElement);
    assert.is(value,"old");
    inputElement.value = "new";
    assert.is(value,"old"); // not yet seen since event not yet fired
    fireChangeEvent(inputElement);
    assert.is(value, "new");
});

domSuite.add("select with children", assert => {
    const [root]   = dom('<div><p><a></a></p></div>');
    const [result1] = select(root, "a");       // one hit
    assert.is(result1.nodeName, "A");
    const result2 = select(root, "p, a");      // combined selector
    assert.is(result2.count$(), 2);
    const result3 = select(root, "*");         // wildcard does not include the root
    assert.is(result3.count$(), 2);
});

domSuite.add("failed select should log a warning", assert => {
    const [root]   = dom('<div><p><a></a></p></div>');
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_WARN);
        setLoggingContext("ch.fhnw.kolibri.util.dom");

        const result = select(root, "no-such-selector");

        assert.is(result.count$(), 0);
        assert.is(appender.getValue()[0], 'Selector "no-such-selector" did not select any nodes in "<div><p><a></a></p></div>"');
    });
});
domSuite.run();
