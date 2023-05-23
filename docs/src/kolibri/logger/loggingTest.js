import {TestSuite}                  from "../util/test.js";
import {Appender as ArrayAppender } from "./appender/arrayAppender.js";

import {
    addToAppenderList,
    removeFromAppenderList,
    setMessageFormatter,
    getMessageFormatter,
    onMessageFormatterChanged,
    onAppenderAdded,
    onAppenderRemoved,
} from "./logging.js";

const loggingSuite = TestSuite("Logging");

loggingSuite.add("message formatter", assert => {
    const oldFormatter = getMessageFormatter();
    const newFormatter = _ => _lvl => msg => msg + " formatted";
    let changed        = false;
    onMessageFormatterChanged(() => changed = true);
    setMessageFormatter(newFormatter);
    assert.is(getMessageFormatter(), newFormatter);
    assert.is(changed, true);

    setMessageFormatter(oldFormatter);
});

loggingSuite.add("listening to appender added/removed", assert => {
    let added        = false;
    let removed      = false;

    onAppenderAdded(  () => added = true);
    onAppenderRemoved(() => removed = true);

    const arrayAppender = ArrayAppender();
    addToAppenderList(arrayAppender);
    assert.is(added, true);

    removeFromAppenderList(arrayAppender);
    assert.is(removed, true);

});

loggingSuite.run();
