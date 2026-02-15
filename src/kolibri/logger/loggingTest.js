import { TestSuite }     from "../util/test.js";
import { ArrayAppender } from "./appender/arrayAppender.js";

import {
    addToAppenderList,
    removeFromAppenderList,
    setGlobalMessageFormatter,
    getGlobalMessageFormatter,
    onGlobalMessageFormatterChanged,
    onAppenderAdded,
    onAppenderRemoved,
} from "./logging.js";

const loggingSuite = TestSuite("logger/Logging");

loggingSuite.add("message formatter", assert => {
    const oldFormatter = getGlobalMessageFormatter();
    const newFormatter = _ => _lvl => msg => msg + " formatted";
    let changed        = false;
    onGlobalMessageFormatterChanged(() => changed = true);
    setGlobalMessageFormatter(newFormatter);
    assert.is(getGlobalMessageFormatter(), newFormatter);
    assert.is(changed, true);

    setGlobalMessageFormatter(oldFormatter);
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
