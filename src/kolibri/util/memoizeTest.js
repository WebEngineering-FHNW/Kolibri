import { TestSuite }                          from "./test.js";
import { withDebugTestArrayAppender }         from "../logger/loggerTest.js";
import { setLoggingLevel, setLoggingContext } from "../logger/logging.js";
import { LOG_DEBUG }                          from "../logger/logLevel.js";
import { memoize }                            from "./memoize.js";

const memoizeSuite = TestSuite("util/memoize");

const makeFib = () => {
    let fib = n => n < 2 ? 1 : fib(n-1) + fib(n-2);
    fib = memoize(fib);
    return fib;
};

// this must come first or the logging numbers spill over
memoizeSuite.add("hit count is logged on debug level", assert => {
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_DEBUG);
        setLoggingContext("ch.fhnw.kolibri.util.memoize");

        const fib = makeFib();
        assert.is(fib(0), 1);
        assert.is(fib(1), 1);
        assert.is(fib(2), 2);

        assert.is(appender.getValue().length, 2);
        assert.is(appender.getValue()[0], "memoized cache hits: 1");
        assert.is(appender.getValue()[1], "memoized cache hits: 2");
    });
});

memoizeSuite.add("simple usage does not interfere", assert => {
    const fib = makeFib();
    assert.is(fib(0), 1);
    assert.is(fib(1), 1);
    assert.is(fib(2), 2);
    assert.is(fib(100), 573147844013817200000);

    const twice = n => 2 * n;
    const memTwice = memoize(twice);
    assert.is(memTwice(1), 2); // make sure that the caches are not shared
});

memoizeSuite.run();
