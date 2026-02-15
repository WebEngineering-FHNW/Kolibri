// noinspection DuplicatedCode,FunctionTooLongJS

import {ObservableMap, originSymbol}        from "./observableMap.js";
import {TestSuite}                          from "../util/test.js";

const suite = TestSuite("observable/observableMap");

suite.add("basic get/set", assert => {

    const observableMap = ObservableMap("test");

    const notFound = observableMap.getValue("no-such-key");
    notFound
        (_ => assert.isTrue(true))
        (_v=> assert.isTrue(false)); // we must not get a value

    const goodValue = Object("goodValue");
    observableMap.setValue("goodKey",goodValue);

    const willBeFound = observableMap.getValue("goodKey");
    willBeFound
        (_ => assert.isTrue(false))
        (v => assert.is(goodValue, v));

    // while the object identity stayed the same, the observable map
    // added a symbol to keep track of the origin of the change
    assert.is(goodValue[originSymbol], "test");

    observableMap.setValue("goodKey", undefined);

    // values are never undefined
    const noUndefined = observableMap.getValue("goodKey");
    noUndefined
        (_  => assert.isTrue(true))
        (_v => assert.isTrue(false));

    observableMap.setValue("goodKey", null);

    // values are never null
    const noNull = observableMap.getValue("goodKey");
    noNull
        (_  => assert.isTrue(true))
        (_v => assert.isTrue(false));

});

suite.add("listeners", assert => {

    const added   = [];
    const removed = [];
    const changed = [];

    const observableMap = ObservableMap("test");

    const valueA = Object("valueA");
    observableMap.setValue("keyA",valueA);

    assert.is(added  .length, 0);
    assert.is(removed.length, 0);
    assert.is(changed.length, 0);

    observableMap.onKeyAdded  ( key => added  .push(key));
    observableMap.onKeyRemoved( key => removed.push(key));

    // nothing changed, yet
    assert.is(added  .length, 0);
    assert.is(removed.length, 0);
    assert.is(changed.length, 0);

    observableMap.onChange( (key, value) => changed.push( [key, value] ));

    // immediate callback when registering
    assert.is(added  .length, 0);
    assert.is(removed.length, 0);
    assert.is(changed.length, 1);
    assert.is(changed.at(-1)[0], "keyA");
    assert.is(changed.at(-1)[1], valueA);

    // value change

    const valueA2 = Object("valueA2");
    observableMap.setValue("keyA",valueA2);

    assert.is(added.length,   0);
    assert.is(removed.length, 0);
    assert.is(changed.length, 2);
    assert.is(changed.at(-1)[0], "keyA");
    assert.is(changed.at(-1)[1], valueA2);

    // new value adds and changes

    const valueB = { b: "B" };
    observableMap.setValue("keyB",valueB);

    assert.is(added.length, 1);
    assert.is(removed.length, 0);
    assert.is(changed.length, 3);
    assert.is(changed.at(-1)[0], "keyB");
    assert.is(changed.at(-1)[1], valueB);

    // setting to the identical value is not a change
    observableMap.setValue("keyB",valueB);

    assert.is(added.length, 1);
    assert.is(removed.length, 0);
    assert.is(changed.length, 3);
    assert.is(changed.at(-1)[0], "keyB");
    assert.is(changed.at(-1)[1], valueB);

    // setting to the identical value is not a change - even if the value changed internally
    valueB.b = "changedB";
    observableMap.setValue("keyB",valueB);

    assert.is(added.length, 1);
    assert.is(removed.length, 0);
    assert.is(changed.length, 3);
    assert.is(changed.at(-1)[0], "keyB");
    assert.is(changed.at(-1)[1], valueB);

    // but one can enforce the change by making a shallow copy (origin symbol is not copied)
    const newValue = {...valueB};
    newValue.b = "changedAgain";                // note that any change must be applied to the _copy_
    observableMap.setValue("keyB", newValue );

    assert.is(added.length, 1);
    assert.is(removed.length, 0);
    assert.is(changed.length, 4);
    assert.is(changed.at(-1)[0], "keyB");
    assert.is(changed.at(-1)[1], newValue);

    // but one can enforce the change by making a shallow copy (origin symbol is not copied)
    const newValueC = {...newValue};
    // it does not even need an _actual_ change
    observableMap.setValue("keyB", newValueC );

    assert.is(added.length, 1);
    assert.is(removed.length, 0);
    assert.is(changed.length, 5);
    assert.is(changed.at(-1)[0], "keyB");
    assert.is(changed.at(-1)[1], newValueC);

    // how to remove
    observableMap.removeKey("keyB");

    assert.is(added.length, 1);
    assert.is(removed.length, 1);
    assert.is(changed.length, 5);

    // null or undefined removes (is not a change)
    observableMap.setValue("keyA", null);

    assert.is(added.length, 1);
    assert.is(removed.length, 2);
    assert.is(changed.length, 5);

    // which means that onChange listeners will
    // never be called with a null or undefined value

});

// todo: test sequence stability under debounce
// todo: test no zombie resurrection
// todo: test value equivalence checks

suite.run();
