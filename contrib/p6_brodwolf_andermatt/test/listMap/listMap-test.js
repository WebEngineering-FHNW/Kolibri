import {TestSuite} from "../test.js";

import {id, beq, True, False, showBoolean as show, convertToJsBool, pair, triple, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, not} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsnum, is0, churchAddition} from '../../src/lambda-calculus-library/church-numerals.js';
import {
    hasPre, push, pop, head, size, startStack, stack,
    pushToStack, convertArrayToStack, getElementByIndex
} from "../../src/stack/stack.js";

import {
    listMap, startListMap, emptyListMap, removeByKey, getElementByKey
}from "../../src/listMap/listMap.js";

const listMapSuite = TestSuite("List Map (pure functional data structure)");

// Test data
const personList = [
    {firstName: 'Peter', lastName: 'Pan', age: 30, income: 1000},
    {firstName: 'Marc', lastName: 'Hunt', age: 28, income: 2000},
    {firstName: 'Luc', lastName: 'Skywalker', age: 36, income: 3000},
    {firstName: 'Han', lastName: 'Solo', age: 55, income: 4000},
    {firstName: 'Tyrion', lastName: 'Lennister', age: 40, income: 5000}
];
Object.freeze(personList);

const p0 = pair(15)(personList[0])
const p1 = pair(16)(personList[1])
const p2 = pair(17)(personList[2])
const p3 = pair(18)(personList[3])
const p4 = pair(19)(personList[4])

const testListMap = startListMap
(pushToStack) ( p0 )
(pushToStack) ( p1 )
(pushToStack) ( p2 )
(pushToStack) ( p3 )
(pushToStack) ( p4 )
(id)



listMapSuite.add("emptyListMap", assert => {
    assert.equals(convertToJsBool(hasPre(emptyListMap)), false);
    assert.equals((pop(emptyListMap))(fst), id);
    assert.pairEquals((pop(emptyListMap))(snd), pair(id)(id));
    assert.equals(size(emptyListMap), n0);
    assert.pairEquals(head(emptyListMap), pair(id)(id));
});


listMapSuite.add("getElementByKey", assert => {
    assert.equals( getElementByKey(testListMap)(15), personList[0]);
    assert.equals( getElementByKey(testListMap)(16), personList[1]);
    assert.equals( getElementByKey(testListMap)(17), personList[2]);
    assert.equals( getElementByKey(testListMap)(18), personList[3]);
    assert.equals( getElementByKey(testListMap)(19), personList[4]);

    assert.equals( getElementByKey(testListMap)(1000), id);
    assert.equals( getElementByKey(testListMap)(-12), id);

    assert.equals( getElementByKey(testListMap)("random"), id);
});

listMapSuite.add("removeByKey", assert => {
    const elements = convertArrayToStack(["Hello", "Haskell", "you", "Rock", "the", "World"]);

    assert.equals( getElementByKey(testListMap)(17), personList[2]);

    assert.churchNumberEquals( size(testListMap), n5);

    assert.pairEquals(getElementByIndex(testListMap)(n1), p0);
    assert.pairEquals(getElementByIndex(testListMap)(n2), p1);
    assert.pairEquals(getElementByIndex(testListMap)(n3), p2);
    assert.pairEquals(getElementByIndex(testListMap)(n4), p3);
    assert.pairEquals(getElementByIndex(testListMap)(n5), p4);

    const listMapUnderTest = removeByKey(testListMap)(17)

    assert.churchNumberEquals( size(listMapUnderTest), n4);

    assert.pairEquals(getElementByIndex(listMapUnderTest)(n1), p0);
    assert.pairEquals(getElementByIndex(listMapUnderTest)(n2), p1);
    assert.pairEquals(getElementByIndex(listMapUnderTest)(n3), p3);
    assert.pairEquals(getElementByIndex(listMapUnderTest)(n4), p4);

    assert.equals( getElementByKey(listMapUnderTest)(17), id);
});

listMapSuite.report();
