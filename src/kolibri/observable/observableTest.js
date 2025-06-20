
import {Observable}                         from "./observable.js"
import {TestSuite}                          from "../util/test.js";
import {Walk}                               from "../sequence/constructors/range/range.js";
import {withDebugTestArrayAppender}         from "../logger/loggerTest.js";
import {setLoggingContext, setLoggingLevel} from "../logger/logging.js";
import {LOG_WARN}                           from "../logger/logLevel.js";

const observableSuite = TestSuite("observable");

observableSuite.add("value", assert => {

    const obs = Observable("");


//  initial state
    assert.is(obs.getValue(),  "");

//  subscribers get notified
    let found;
    obs.onChange(val => found = val);
    obs.setValue("firstValue");
    assert.is(found, "firstValue");

//  value is updated
    assert.is(obs.getValue(), "firstValue");


//  Attributes are isolated, no "new" needed
    const secondAttribute = Observable("");

//  initial state
    assert.is(secondAttribute.getValue(),  "");

//  subscribers get notified
    let secondFound;
    secondAttribute.onChange(val => secondFound = val);
    secondAttribute.setValue("secondValue");
    assert.is(found,       "firstValue");
    assert.is(secondFound, "secondValue");

//  value is updated
    assert.is(secondAttribute.getValue(),  "secondValue");

});

observableSuite.add("edge case", assert => {
    // tricky edge case with multiple (here two) subscribers where a subscriber himself -
    // directly or indirectly - causes the observable value to change again while in the callback.
    // One has to decide whether to allow
    //     out-of-order updates (very bad),
    //     doubled updates (not nice),
    //     missing intermediate updates (our choice here)
    // We give up the invariant that all subscribers see all value changes,
    // but we can keep the invariant that all subscribers see the same last value change and
    // thus all subscribers agree on the same final value.

    const obs = Observable("start");

    const log1 = [];
    const log2 = [];
    let   allowChange = false;

    obs.onChange((val, oldVal) => { // first subscriber changes obs value itself when notified: tricky edge case
        log1.push(oldVal, val);
        if (allowChange) {
            allowChange = false; // prevent endless changes that would lead to stack overflow
            obs.setValue(val + "_x");
        }
    });
    obs.onChange((val,oldVal) => log2.push(oldVal, val));

    assert.is(["start", "start"].eq(log1), true);
    assert.is(["start", "start"].eq(log2), true);

    allowChange = true;
    obs.setValue("second");

    // first observer has seen all value changes
    assert.is(["start", "start", "start", "second", "second", "second_x"].eq(log1), true);
    // the second observer might _not_ have seen all value changes, but he sees
    // at least the last proper value change !!!
    assert.is(["start", "start", "second", "second_x"].eq(log2), true);
});

observableSuite.add("memory leak warning", assert => {
    const obs = Observable( 0 ); // decorator pattern

    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_WARN);
        setLoggingContext("ch.fhnw.kolibri.observable");

        Walk(100).forEach$( _n => obs.onChange( _x => undefined) );
        obs.onChange( _x => undefined); // one to many

        assert.is(appender.getValue()[0], 'Beware of memory leak. 101 listeners.');
    });

    assert.is(obs.getValue(), 0);
});

observableSuite.add("no memory leak warning if removed", assert => {
    const obs = Observable( 0 ); // decorator pattern

    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_WARN);
        setLoggingContext("ch.fhnw.kolibri.observable");

        Walk(100).forEach$( _n => obs.onChange( (_val, _old, removeMe) => removeMe()) );
        obs.setValue(1);                // triggers the self-removal of all previous listeners
        obs.onChange( _x => undefined); // no longer: one to many

        assert.is(appender.getValue().length, 0);
    });

    assert.is(obs.getValue(), 1);
});

observableSuite.run();
