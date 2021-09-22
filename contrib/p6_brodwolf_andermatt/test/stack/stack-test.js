import {TestSuite} from "../test.js";

import {id, beq, True, False, showBoolean as show, convertToJsBool, pair, triple, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, not} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, pred, succ, jsnum, is0, churchAddition} from '../../src/lambda-calculus-library/church-numerals.js';
import {
    stack, stackIndex, stackPredecessor, stackValue, emptyStack,
    hasPre, push, pop, head, size, reduce, filter, map,
    getElementByIndex, logStackToConsole, getElementByJsnumIndex, startStack,
    pushToStack, reverseStack, filterWithReduce,
    mapWithReduce, convertStackToArray, convertArrayToStack, forEach, removeByIndex
} from "../../src/stack/stack.js";

const stackSuite = TestSuite("stack (pure functional data structure)");

// Test data
const personList = [
    {firstName: 'Peter', lastName: 'Pan', age: 30, income: 1000},
    {firstName: 'Marc', lastName: 'Hunt', age: 28, income: 2000},
    {firstName: 'Luc', lastName: 'Skywalker', age: 36, income: 3000},
    {firstName: 'Han', lastName: 'Solo', age: 55, income: 4000},
    {firstName: 'Tyrion', lastName: 'Lennister', age: 40, income: 5000}
];
Object.freeze(personList);

const personStack = push(push(push(push(push(emptyStack)(personList[0]))(personList[1]))(personList[2]))(personList[3]))(personList[4]);
const nonEmptyStack = push(push(push(emptyStack)(0))(1))(2);
const stackWithNumbers = push(push(push(nonEmptyStack)(33))(34))(35);

stackSuite.add("emptyStack", assert => {
    assert.equals(convertToJsBool(hasPre(emptyStack)), false);
    assert.equals((pop(emptyStack))(fst), id);
    assert.equals((pop(emptyStack))(snd), id);
    assert.equals(size(emptyStack), n0);
    assert.equals(head(emptyStack), id);
});

stackSuite.add("hasPre", assert => {
    assert.equals(convertToJsBool(hasPre(emptyStack)), false);
    assert.equals(convertToJsBool(hasPre(nonEmptyStack)), true);
    assert.equals(convertToJsBool(hasPre(pop(push(emptyStack)(0))(fst))), false);
});

stackSuite.add("push", assert => {
    assert.equals(convertToJsBool(hasPre(push(emptyStack)(5))), true);
    assert.equals(head(nonEmptyStack), 2);
    assert.equals(jsnum(size(nonEmptyStack)), 3);
    assert.equals(pop(push(emptyStack)(42))(snd), 42);
});

stackSuite.add("pop", assert => {
    assert.equals(pop(nonEmptyStack)(snd), 2);
    assert.equals(pop(pop(nonEmptyStack)(fst))(snd), 1);
    assert.equals(pop(pop(pop(nonEmptyStack)(fst))(fst))(snd), 0);
    assert.equals((pop(pop(pop(nonEmptyStack)(fst))(fst))(fst))(snd), id);
    assert.equals(jsnum(size((pop(nonEmptyStack))(fst))), 2);
});

stackSuite.add("head", assert => {
    const nonEmptyStack = push(push(emptyStack)(0))(1);

    assert.equals(head(nonEmptyStack), 1);
    assert.equals(head((pop(nonEmptyStack))(fst)), 0);
});

stackSuite.add("size", assert => {
    const nonEmptyStack = push(push(emptyStack)(0))(1);

    assert.churchNumberEquals(size(nonEmptyStack), n2);
    assert.equals(jsnum(size(push(nonEmptyStack)(42))), 3);
    assert.equals(jsnum(size(pop(nonEmptyStack)(fst))), 1);
    assert.equals(jsnum(size(emptyStack)), 0);
});

stackSuite.add("random", assert => {
    // has empty stack no predecessor
    assert.equals(convertToJsBool
    (beq
        (hasPre(emptyStack))
        (False)
    ), true);

    // has non-empty stack a predecessor
    assert.equals(convertToJsBool
    (beq
        (hasPre(push(emptyStack)(id)))
        (True)
    ), true);

    // pop returns the pushed value
    assert.equals(convertToJsBool
    (beq
        ((pop(push(emptyStack)(id)))(snd)(True))
        (True)
    ), true);

    // pop returns predecessor stack
    assert.equals(pop(push(emptyStack)(id))(fst) === emptyStack, true);

    // returns head
    assert.equals(convertToJsBool
    (beq
        ((head(push(emptyStack)(id)))(True))
        (True)
    ), true);
});

stackSuite.add("getElementByIndex", assert => {
    assert.equals(getElementByIndex(stackWithNumbers)(n0), id);
    assert.equals(getElementByIndex(stackWithNumbers)(n1), 0);
    assert.equals(getElementByIndex(stackWithNumbers)(n2), 1);
    assert.equals(getElementByIndex(stackWithNumbers)(n3), 2);
    assert.equals(getElementByIndex(stackWithNumbers)(n4), 33);
    assert.equals(getElementByIndex(stackWithNumbers)(n5), 34);
    assert.equals(getElementByIndex(stackWithNumbers)(n6), 35);
});

stackSuite.add("getElementByIndexJs", assert => {
    assert.equals(getElementByJsnumIndex(stackWithNumbers)(0), id);
    assert.equals(getElementByJsnumIndex(stackWithNumbers)(1), 0);
    assert.equals(getElementByJsnumIndex(stackWithNumbers)(2), 1);
    assert.equals(getElementByJsnumIndex(stackWithNumbers)(3), 2);
    assert.equals(getElementByJsnumIndex(stackWithNumbers)(4), 33);
    assert.equals(getElementByJsnumIndex(stackWithNumbers)(5), 34);
    assert.equals(getElementByJsnumIndex(stackWithNumbers)(6), 35);
});

stackSuite.add("reduce", assert => {
    const stackWithNumbers = nonEmptyStack;
    const stackWithChurchNumbers = push(push(push(emptyStack)(n9))(n2))(n3);

    const reduceFunctionSum = (acc, curr) => acc + curr;
    const reduceFunctionChurchNumbersSum = (acc, curr) => churchAddition(acc)(curr);
    const reduceToArray = (acc, curr) => [...acc, curr];

    assert.equals(reduce(stackWithNumbers)(pair(reduceFunctionSum)(0)), 3);
    assert.equals(reduce(push(stackWithNumbers)(3))(pair(reduceFunctionSum)(0)), 6);
    assert.equals(reduce(personStack)(pair((acc, curr) => acc + curr.income)(0)), 15000);
    assert.equals(jsnum(reduce(stackWithChurchNumbers)(pair(reduceFunctionChurchNumbersSum)(n0))), 14);
    assert.arrayEquals(reduce(stackWithNumbers)(pair(reduceToArray)([])), [0, 1, 2]);
});

stackSuite.add("map", assert => {
    const stackWithNumbers = push(push(push(emptyStack)(10))(20))(30);
    const stackWithChurchNumbers = push(push(push(emptyStack)(n2))(n4))(n8);

    const multiplyWith2 = x => x * 2;
    const mapToJsnum = churchNum => jsnum(churchNum);

    const mappedStackWithNumbers = map(stackWithNumbers)(multiplyWith2);
    const mappedStackWithChurchNumbers = map(stackWithChurchNumbers)(mapToJsnum);

    assert.equals(head(mappedStackWithNumbers), 60);
    assert.equals(jsnum(size(mappedStackWithNumbers)), 3);
    assert.equals(head(pop(mappedStackWithNumbers)(fst)), 40);
    assert.equals(head(pop(pop(mappedStackWithNumbers)(fst))(fst)), 20);
    assert.equals(head(pop(pop(pop(mappedStackWithNumbers)(fst))(fst))(fst)), id);

    assert.equals(head(mappedStackWithChurchNumbers), 8);
    assert.equals(jsnum(size(mappedStackWithChurchNumbers)), 3);
    assert.equals(head(pop(mappedStackWithChurchNumbers)(fst)), 4);
    assert.equals(head(pop(pop(mappedStackWithChurchNumbers)(fst))(fst)), 2);
    assert.equals(head(pop(pop(pop(mappedStackWithChurchNumbers)(fst))(fst))(fst)), id);
});

stackSuite.add("filter", assert => {
    const filteredStackWithNumbers = filter(stackWithNumbers)(x => x < 35 && x > 2);
    const filteredStackWithLastNames = map(filter(personStack)(person => person.lastName.startsWith('S')))(person => person.lastName);
    const filteredStackWithIncome = filter(personStack)(person => person.income > 5000);


    assert.equals(jsnum(size(filteredStackWithNumbers)), 2);
    assert.equals(getElementByJsnumIndex(filteredStackWithNumbers)(0), id);
    assert.equals(getElementByJsnumIndex(filteredStackWithNumbers)(1), 33);
    assert.equals(getElementByJsnumIndex(filteredStackWithNumbers)(2), 34);
    assert.equals(jsnum(size(filteredStackWithLastNames)), 2);
    assert.equals(getElementByJsnumIndex(filteredStackWithLastNames)(0), id);
    assert.equals(getElementByJsnumIndex(filteredStackWithLastNames)(1), "Skywalker");
    assert.equals(getElementByJsnumIndex(filteredStackWithLastNames)(2), "Solo");
    assert.equals(jsnum(size(filteredStackWithIncome)), 0);
    assert.equals(head(filteredStackWithIncome), id);
    assert.equals(filteredStackWithIncome(stackPredecessor), id);
    assert.equals(filteredStackWithIncome, emptyStack);
});

stackSuite.add("startStack", assert => {
    const result = startStack(pushToStack)(2)(pushToStack)(3)(pushToStack)(4)(id);

    assert.equals(getElementByJsnumIndex(result)(0), id);
    assert.equals(getElementByJsnumIndex(result)(1), 2);
    assert.equals(getElementByJsnumIndex(result)(2), 3);
    assert.equals(getElementByJsnumIndex(result)(3), 4);
    assert.equals(jsnum(size(result)), 3);
});

stackSuite.add("reverse stack", assert => {
    const reversedStack = reverseStack(nonEmptyStack);

    assert.equals(getElementByJsnumIndex(reversedStack)(0), id);
    assert.equals(getElementByJsnumIndex(reversedStack)(1), 2);
    assert.equals(getElementByJsnumIndex(reversedStack)(2), 1);
    assert.equals(getElementByJsnumIndex(reversedStack)(3), 0);
    assert.equals(jsnum(size(reversedStack)), 3);
});

stackSuite.add("filter with reduce-function", assert => {
    const filteredStack = filterWithReduce(stackWithNumbers)(x => x >= 2 && x < 34);

    assert.equals(getElementByJsnumIndex(filteredStack)(0), id);
    assert.equals(getElementByJsnumIndex(filteredStack)(1), 2);
    assert.equals(getElementByJsnumIndex(filteredStack)(2), 33);
    assert.equals(jsnum(size(filteredStack)), 2);
});

stackSuite.add("map with reduce-function", assert => {
    const mappedStack = mapWithReduce(nonEmptyStack)(x => x * 3);

    assert.equals(getElementByJsnumIndex(mappedStack)(0), id);
    assert.equals(getElementByJsnumIndex(mappedStack)(1), 0);
    assert.equals(getElementByJsnumIndex(mappedStack)(2), 3);
    assert.equals(getElementByJsnumIndex(mappedStack)(3), 6);
    assert.equals(jsnum(size(mappedStack)), 3);
});

stackSuite.add("convert stack to array", assert => {
    const result = convertStackToArray(stackWithNumbers);

    assert.equals(result.length, 6);
    assert.arrayEquals(result, [0, 1, 2, 33, 34, 35]);
});

stackSuite.add("convert array to stack", assert => {
    const result = convertArrayToStack([1, 2, 3]);

    assert.equals(jsnum(size(result)), 3);
    assert.equals(getElementByJsnumIndex(result)(0), id);
    assert.equals(getElementByJsnumIndex(result)(1), 1);
    assert.equals(getElementByJsnumIndex(result)(2), 2);
    assert.equals(getElementByJsnumIndex(result)(3), 3);
});

stackSuite.add("for / foreach loop - stack implementation", assert => {
    const stackWithNumbers = startStack(pushToStack)(5)(pushToStack)(10)(pushToStack)(15)(id);

    const elements = [];
    const indices = [];

    const forEachCallback = (element, index) => {
        elements.push(element);
        indices.push(index);
    };

    forEach(stackWithNumbers)(forEachCallback);

    assert.equals(elements.length, 3);
    assert.equals(indices.length, 3);

    assert.equals(elements[0], 5);
    assert.equals(elements[1], 10);
    assert.equals(elements[2], 15);

    assert.equals(indices[0], 1);
    assert.equals(indices[1], 2);
    assert.equals(indices[2], 3);
});

stackSuite.add("removeByIndex", assert => {
    const elements = convertArrayToStack(["Hello", "Haskell", "you", "Rock", "the", "World"]);
    const result = removeByIndex(elements)(2) // "Haskell"

    assert.arrayEquals( convertStackToArray(result), ["Hello", "you", "Rock", "the", "World"]);
    assert.churchNumberEquals( size(result), n5);

    const resultEndIndex = removeByIndex(result)(5) // "World"
    assert.arrayEquals( convertStackToArray(resultEndIndex), ["Hello", "you", "Rock", "the"]);
    assert.churchNumberEquals( size(resultEndIndex), n4);

    const resultStartIndex = removeByIndex(resultEndIndex)(1) // "Hello"
    assert.arrayEquals( convertStackToArray(resultStartIndex), ["you", "Rock", "the"]);
    assert.churchNumberEquals( size(resultStartIndex), n3);


    const resultToEmptyStack = removeByIndex(removeByIndex(removeByIndex(resultStartIndex)(1))(1))(1)
    assert.arrayEquals( convertStackToArray(resultToEmptyStack), []);
    assert.churchNumberEquals( size(resultToEmptyStack), n0);

    const resultEmpty = removeByIndex(emptyStack)(4)
    assert.arrayEquals( convertStackToArray(resultEmpty), []);
    assert.churchNumberEquals( size(resultEmpty), n0);

    const resultNotAvailableIndex =  removeByIndex(elements)(42) // not existing Index
    assert.arrayEquals( convertStackToArray(resultNotAvailableIndex), ["Hello", "Haskell", "you", "Rock", "the", "World"]);
    assert.churchNumberEquals( size(resultNotAvailableIndex), n6);

});

stackSuite.report();
