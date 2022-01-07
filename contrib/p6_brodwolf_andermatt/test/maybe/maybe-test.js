import {TestSuite} from "../test.js";
import {id, pair} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {jsNum} from "../../src/lambda-calculus-library/church-numerals.js";
import {Nothing, Just, maybeDivision, eitherDomElement, getOrDefault, getDomElement, getDomElements, maybeTruthy, maybeDomElement, eitherNumber, eitherElementsOrErrorsByFunction, maybeElementsByFunction, eitherTryCatch} from "../../src/maybe/maybe.js";
import {getElementByIndex, size} from "../../src/stack/stack.js";
import {getElementByKey} from "../../src/listMap/listMap.js"

const maybeSuite = TestSuite("Maybe");

const dummyDomElem = document.createElement('div');
const dummyDomElem2 = document.createElement('div');

const setup = () => {
    dummyDomElem.setAttribute('id', 'test');
    dummyDomElem2.setAttribute('id', 'test2');
    document.body.appendChild(dummyDomElem);
    document.body.appendChild(dummyDomElem2);
}

const tearDown = () => {
    const dummyDomElem = document.getElementById('test')
    const dummyDomElem2 = document.getElementById('test2')

    dummyDomElem.remove();
    dummyDomElem2.remove();
}

maybeSuite.add("Nothing", assert => {
    assert.equals( Nothing(() => 12)(() => 15), 12);
    assert.equals( Nothing(() => 15)(() => 12), 15);
    assert.equals( Nothing(() => id(122))(() => id(32)), 122);
    assert.equals( Nothing(() => 12 + 12)(0), 24);
});

maybeSuite.add("Just", assert => {
    assert.equals( Just(10)((val => val + 10))(val => val + 20), 30);
    assert.equals( Just(10)((_ => true))(_ => false), false);
    assert.equals( Just(id)((f => f(false)))(f => f(true)), true);
});

maybeSuite.add("maybeElement", assert => {
    assert.equals( maybeTruthy(false)(() => 10)(() => 42), 10);
    assert.equals( maybeTruthy(null)(() => 34)(() => 42), 34);
    assert.equals( maybeTruthy(undefined)(() => 10)(() => 42), 10);
    assert.equals( maybeTruthy(true)(() => 10)(() => 42), 42);
    assert.equals( maybeTruthy(0)(() => 10)(() => 42), 10);
    assert.equals( maybeTruthy(1)(() => 10)(() => 42), 42);
});

maybeSuite.add("maybeDiv", assert => {
    assert.equals( maybeDivision(10)(2)(val => val + 10)(val => val + 3), 8);
    assert.equals( maybeDivision(10)(0)(_ => "Nothing")(_ => "Just"), "Nothing");
    assert.equals( maybeDivision(10)(3)(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals( maybeDivision("Hello")("World")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("eitherJsNumOrOther", assert => {
    assert.equals( eitherNumber(10)(_ => "Nothing")(x => x + 5), 15);
    assert.equals( eitherNumber("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
});

maybeSuite.add("maybeDomElement", assert => {
    setup()
    assert.equals( eitherDomElement("test")(_ => "Nothing")(_ => "Just"), "Just");
    assert.equals( eitherDomElement("Not a Number")(_ => "Nothing")(_ => "Just"), "Nothing");
    tearDown()
});

maybeSuite.add("getDomElement", assert => {
    setup()
    assert.equals(getDomElement("test"), dummyDomElem);

    const elementNotExistName = "elementNotExist"
    const methodUnderTest = () => getDomElement(elementNotExistName)
    assert.consoleErrorEquals(methodUnderTest, `no element exist with id: ${elementNotExistName}`)

    tearDown()
});

maybeSuite.add("getDomElements", assert => {
    setup()
    assert.arrayEquals( getDomElements("test", "test"), [dummyDomElem, dummyDomElem]);

    const elementNotExistName = "elementNotExist"
    const methodUnderTest = () => getDomElements(elementNotExistName, "test")
    assert.consoleErrorEquals(methodUnderTest, `no element exist with id: ${elementNotExistName}`)
    tearDown();
});

maybeSuite.add("getOrDefault", assert => {
    setup()
    assert.equals( getOrDefault(eitherNumber(5))(0), 5);
    assert.equals( getOrDefault(eitherNumber("NaN"))(42), 42);
    assert.equals( getOrDefault(eitherNumber("5"))(42), 42);
    assert.equals( getOrDefault(eitherNumber((() => 5)()))(42), 5);
    tearDown();
});

maybeSuite.add("eitherElementsOrErrors - good case", assert => {
    setup();

    const result = eitherElementsOrErrorsByFunction(eitherDomElement)("test", "test2")
                            (id)
                            (id);

    assert.equals( jsNum(size(result)), 2);

    assert.pairEquals( getElementByIndex(result)(0), pair(id)(id));
    assert.pairEquals( getElementByIndex(result)(1), pair("test")(dummyDomElem));
    assert.pairEquals( getElementByIndex(result)(2), pair("test2")(dummyDomElem2));

    assert.equals( getElementByKey(result)("test"), dummyDomElem);
    assert.equals( getElementByKey(result)("test2"), dummyDomElem2);

    tearDown();
});

maybeSuite.add("eitherElementsOrErrors - bad case", assert => {
    setup();

    const result = eitherElementsOrErrorsByFunction(eitherDomElement)("random1", "random2")
                            (id)
                            (id);

    assert.equals( jsNum(size(result)), 2);

    assert.equals( getElementByIndex(result)(0), id);
    assert.equals( getElementByIndex(result)(1),"no element exist with id: random1");
    assert.equals( getElementByIndex(result)(2), "no element exist with id: random2");

    tearDown();
});


maybeSuite.add("maybeElementsByFunction", assert => {
    setup();

    const result = maybeElementsByFunction( maybeDomElement )("test", "test2")
                    (id)
                    (id);

    assert.equals( jsNum(size(result)), 2);

    assert.pairEquals( getElementByIndex(result)(0), pair(id)(id));
    assert.pairEquals( getElementByIndex(result)(1), pair("test")(dummyDomElem));
    assert.pairEquals( getElementByIndex(result)(2), pair("test2")(dummyDomElem2));

    assert.equals( getElementByKey(result)("test"), dummyDomElem);
    assert.equals( getElementByKey(result)("test2"), dummyDomElem2);

    const failedResult = maybeElementsByFunction( maybeDomElement )("random1", "random2")
                                (id)
                                (id);

    assert.equals(failedResult, undefined);

    tearDown();
});

maybeSuite.add("either try catch", assert => {
    const result1 = eitherTryCatch(() => {throw "random error"})
    const result2 = eitherTryCatch(() => 10)
    const result3 = eitherTryCatch(() => "Hello")
    const result4 = eitherTryCatch(() => {throw new TypeError("failed")})


    assert.equals( result1(id)(id), "random error");
    assert.equals( result2(id)(id), 10);
    assert.equals( result3(id)(id), "Hello");
    assert.equals( result1(() => "error")(id), "error");
    assert.equals( result2(() => "error")(() => "success"), "success");
    assert.equals( result3(id)(() => 42), 42);
    assert.equals( result4(e => e.message)(id), "failed");
    assert.equals( result4(e => e.name)(id), "TypeError");
});


maybeSuite.report();
