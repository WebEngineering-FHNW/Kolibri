import { ArrayAppender }          from "./arrayAppender.js";
import { ObservableAppender }     from "./observableAppender.js";
import { TestSuite }              from "../../util/test.js";
import { LOG_DEBUG, LOG_NOTHING } from "../logLevel.js";

const msg1 = "Some Log Message";

const observableAppenderSuite = TestSuite("logger/Observable Appender");

const arrayAppender      = ArrayAppender();
let level;
let msg;
const observableAppender = ObservableAppender(arrayAppender)((newLevel, newMsg) => {
    level = newLevel;
    msg   = newMsg;
});
const {debug, getValue, reset} = observableAppender;

observableAppenderSuite.add("Observable Appender setup", assert => {
    assert.is(level, undefined);
    assert.is(msg, undefined);
    assert.is(arrayAppender.getValue().length, 0);
    debug(msg1);
    assert.is(level, LOG_DEBUG);
    assert.is(msg, msg1);
    assert.is(arrayAppender.getValue().length, 1);
    assert.is(arrayAppender.getValue(), observableAppender.getValue());
    reset();
    assert.is(level, LOG_NOTHING);
    assert.is(getValue().length, 0);
});

observableAppenderSuite.run();
