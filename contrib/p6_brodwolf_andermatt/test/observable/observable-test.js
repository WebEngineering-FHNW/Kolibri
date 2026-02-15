import {TestSuite, BenchmarkTest} from "../test.js";
import {addListener, listenerNewValueToElement, getValue, newListener, newListenerWithCustomKey, setListenerKey, getListenerKey, listenerLogToConsole, Observable, logListenersToConsole, removeListener, setValue} from "../../src/observable/observable.js";

const observableListMapSuite = TestSuite("Observable Pattern with ListMap (pure functional data structure)");

observableListMapSuite.add("Observable", assert => {

    // first Listener
    const observedObject = {};
    const listenerValue = newListener( listenerNewValueToElement(observedObject) )

    assert.equals(observedObject.value, undefined)

    let testObs = Observable(42)
                    (addListener)(listenerValue)

    assert.equals(observedObject.value, 42)


    // second Listener
    let listenerVariable;
    assert.equals(listenerVariable, undefined)

    const listenerValue2 = newListener(nVal => oVal => listenerVariable = nVal)

    testObs = testObs(addListener)(listenerValue2)

    assert.equals(listenerVariable, 42)
});

observableListMapSuite.add("Listeners key-set/get", assert => {

    let listenerTest = newListener(nValue => oValue => "nix")

    assert.true(getListenerKey(listenerTest).toString().length > 5)

    listenerTest = setListenerKey(42)(listenerTest)

    assert.equals(getListenerKey(listenerTest).toString().length, 2)
    assert.equals(getListenerKey(listenerTest), 42)

    const listenerTestKey = setListenerKey(123)(newListener(nValue => oValue => "nix"))
    assert.equals(getListenerKey(listenerTestKey), 123)

    // newListenerWithCustomKey
    const listenerTestKey2 = newListenerWithCustomKey(456)(nValue => oValue => "nix")
    assert.equals(getListenerKey(listenerTestKey2), 456)

    // generate different key
    let listenerKeyGenerate1 = newListener(nValue => oValue => "nix")
    let listenerKeyGenerate2 = newListener(nValue => oValue => "nix")
    assert.true(getListenerKey(listenerKeyGenerate1).toString() !== getListenerKey(listenerKeyGenerate2).toString())
});


observableListMapSuite.add("setValue", assert => {
    const consoleHandler = newListener(listenerLogToConsole)

    const valueHolder = {};
    const valueHandler = newListener(listenerNewValueToElement(valueHolder))

    let testObs;
    const methodeUnderTest1 = () => testObs = Observable(0)
                                                    (addListener)(consoleHandler)
                                                    (addListener)(valueHandler)

    assert.consoleLogEquals(methodeUnderTest1, "Value: new = 0, old = 0")
    assert.equals(valueHolder.value, 0)


    const methodUnderTest2 = () => testObs = testObs(setValue)(66);

    assert.consoleLogEquals(methodUnderTest2, "Value: new = 66, old = 0")
    assert.equals(valueHolder.value, 66)


    const methodUnderTest3 = () => testObs = testObs(setValue)(96);

    assert.consoleLogEquals(methodUnderTest3, "Value: new = 96, old = 66")
    assert.equals(valueHolder.value, 96)
});

observableListMapSuite.add("getValue", assert => {

    let testObs = Observable(0)
    assert.equals(testObs(getValue), 0)

    testObs = testObs(setValue)(66)
    assert.equals(testObs(getValue), 66)

    testObs = testObs(setValue)(42)
    assert.equals(testObs(getValue), 42)
});

observableListMapSuite.add("logListenersToConsole", assert => {
    const consoleHandler = newListenerWithCustomKey(42)(listenerLogToConsole)

    const valueHolder = {};
    const valueHandler = newListenerWithCustomKey(43)(listenerNewValueToElement(valueHolder))


    let testObs;
    const methodeUnderTest1 = () => testObs = Observable("hello")
                                                    (addListener)(consoleHandler)
                                                    (addListener)(valueHandler)

    assert.consoleLogEquals(methodeUnderTest1, "Value: new = hello, old = hello")


    const expectedLogs = [
        "element at: 1: 42 | nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`)",
        "element at: 2: 43 | nVal => oVal => element.value = nVal"]

    assert.consoleLogEquals(() => testObs(logListenersToConsole), ...expectedLogs)
});

observableListMapSuite.add("removeListener", assert => {
    // given
    const listenerConsoleLog = newListener(listenerLogToConsole)

    const observedObject = {};
    const listenerValue = newListener(listenerNewValueToElement(observedObject))

    // when 1
    let testObs;
    const methodeUnderTest = () => testObs = Observable(0)
                                                    (addListener)(listenerConsoleLog)
                                                    (addListener)(listenerValue)

    assert.consoleLogEquals(methodeUnderTest, "Value: new = 0, old = 0")
    assert.equals(observedObject.value, 0)

    const methodUnderTest1 = () => testObs = testObs(setValue)(66);

    // then 1
    assert.consoleLogEquals(methodUnderTest1, "Value: new = 66, old = 0")
    assert.equals(observedObject.value, 66)
    assert.equals(testObs(getValue), 66)

    // when 2
    const methodUnderTest2 = () => testObs = testObs(setValue)(100);

    testObs = testObs(removeListener)(listenerConsoleLog)
    testObs = testObs(removeListener)(listenerValue)

    // then 2
    assert.consoleLogEquals(methodUnderTest2, ...[])
    assert.equals(observedObject.value, 66)
    assert.equals(testObs(getValue), 100)
});


observableListMapSuite.add("benchmark test", assert => {

    let testObs = Observable(1)

    let listOfValuesHandlers = []

    // addListener
    const amountListener = 100;
    for (let i = 0; i <= amountListener; i++) { // limit to 6250
        const valueHolder = {};
        const valueHandler = newListener(listenerNewValueToElement(valueHolder))
        listOfValuesHandlers.push(valueHolder)
        testObs = testObs(addListener)(valueHandler)
    }

    // set Value
    BenchmarkTest('observable set value method ' + amountListener)(() => testObs = testObs(setValue)(66));

    assert.true(listOfValuesHandlers.every(v => v.value === 66));

    BenchmarkTest('observable set value method 1000 times')(() => {
        for (let i = 0; i <= 1000; i++) {
            testObs = testObs(setValue)(i)
        }
    });
    assert.true(listOfValuesHandlers.every(v => v.value === 1000));

});


observableListMapSuite.report();
