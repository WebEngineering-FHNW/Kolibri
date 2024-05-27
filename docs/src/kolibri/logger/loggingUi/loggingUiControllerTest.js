import {TestSuite}           from "../../util/test.js";
import {LoggingUiController} from "./loggingUiController.js";
import {
    toString,
    LOG_DEBUG,
}                            from "../logLevel.js";
import {
    getLoggingContext,
    getLoggingLevel, setLoggingContext,
    setLoggingLevel,
}                            from "../logging.js";

const logUiControllerSuite = TestSuite("logger/LogUiController");

logUiControllerSuite.add("test binding log level as text", assert => {

    const logUiController = LoggingUiController();
    const oldLoggingLevel = getLoggingLevel();
    assert.is(logUiController.loggingLevelController.getValue(), toString(oldLoggingLevel));

    logUiController.loggingLevelController.setValue(toString(LOG_DEBUG));
    assert.is(getLoggingLevel(), LOG_DEBUG);

    logUiController.cleanup();
    setLoggingLevel(oldLoggingLevel);
    assert.is(getLoggingLevel(), oldLoggingLevel);
    assert.is(logUiController.loggingLevelController.getValue(), toString(oldLoggingLevel));
});

logUiControllerSuite.add("test binding log context as text", assert => {

    const logUiController   = LoggingUiController();
    const oldLoggingContext = getLoggingContext();
    assert.is(typeof (oldLoggingContext), "string"); // we don't know the actual value, but it should be a string
    assert.is(logUiController.loggingContextController.getValue(), oldLoggingContext);

    const newLoggingContext = oldLoggingContext + ".test";
    logUiController.loggingContextController.setValue(newLoggingContext);
    assert.is(getLoggingContext(), newLoggingContext);

    logUiController.cleanup();
    setLoggingContext(oldLoggingContext);
    assert.is(getLoggingContext(), oldLoggingContext);
    assert.is(logUiController.loggingContextController.getValue(), oldLoggingContext);
});

logUiControllerSuite.run();
