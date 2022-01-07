import {BenchmarkTest, TestSuite} from "../test.js";
import {beq, jsBool, False, fst, id, pair, snd, True} from "../../src/lambda-calculus-library/lambda-calculus.js";
import {churchAddition, churchMultiplication, jsNum, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9} from '../../src/lambda-calculus-library/church-numerals.js';
import {concat, convertArrayToStack, convertStackToArray, emptyStack, filter, filterWithReduce, flatten, forEach, forEachOld, getElementByIndex, hasPre, head, map, mapWithReduce, pop, push, pushToStack, reduce, removeByIndex, reverseStack, getIndexOfElement, containsElement, maybeIndexOfElement, size, stackEquals, stackPredecessor, startStack, zip, zipWith,eitherElementByIndex} from "../../src/stack/stack.js";
import {Nothing} from "../../src/maybe/maybe.js";

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

const createTestStackWithNElements = n => {
    let testArray = []
    for (let i = 0; i < n; i++) {
        testArray.push(i);
    }

    return convertArrayToStack(testArray);
}

stackSuite.add("emptyStack", assert => {
    const s1 = push(emptyStack)(12)

    assert.equals(jsBool(hasPre(emptyStack)), false);
    assert.equals((pop(emptyStack))(fst), id);
    assert.equals((pop(emptyStack))(snd), id);
    assert.equals(size(emptyStack), n0);
    assert.equals(head(emptyStack), id);
    assert.equals(emptyStack, emptyStack);
    assert.equals(pop((s1))(fst), emptyStack);
});

stackSuite.add("hasPre", assert => {
    assert.equals(jsBool(hasPre(emptyStack)), false);
    assert.equals(jsBool(hasPre(nonEmptyStack)), true);
    assert.equals(jsBool(hasPre(pop(push(emptyStack)(0))(fst))), false);
});

stackSuite.add("push", assert => {
    assert.equals(jsBool(hasPre(push(emptyStack)(5))), true);
    assert.equals(head(nonEmptyStack), 2);
    assert.equals(jsNum(size(nonEmptyStack)), 3);
    assert.equals(pop(push(emptyStack)(42))(snd), 42);
});

stackSuite.add("pop", assert => {
    assert.equals(pop(nonEmptyStack)(snd), 2);
    assert.equals(pop(pop(nonEmptyStack)(fst))(snd), 1);
    assert.equals(pop(pop(pop(nonEmptyStack)(fst))(fst))(snd), 0);
    assert.equals((pop(pop(pop(nonEmptyStack)(fst))(fst))(fst))(snd), id);
    assert.equals(jsNum(size((pop(nonEmptyStack))(fst))), 2);
});

stackSuite.add("head", assert => {
    const nonEmptyStack = push(push(emptyStack)(0))(1);

    assert.equals(head(nonEmptyStack), 1);
    assert.equals(head((pop(nonEmptyStack))(fst)), 0);
});

stackSuite.add("size", assert => {
    const nonEmptyStack = push(push(emptyStack)(0))(1);

    assert.churchNumberEquals(size(nonEmptyStack), n2);
    assert.equals(jsNum(size(push(nonEmptyStack)(42))), 3);
    assert.equals(jsNum(size(pop(nonEmptyStack)(fst))), 1);
    assert.equals(jsNum(size(emptyStack)), 0);
});

stackSuite.add("random", assert => {
    // has empty stack no predecessor
    assert.equals(jsBool
    (beq
        (hasPre(emptyStack))
        (False)
    ), true);

    // has non-empty stack a predecessor
    assert.equals(jsBool
    (beq
        (hasPre(push(emptyStack)(id)))
        (True)
    ), true);

    // pop returns the pushed value
    assert.equals(jsBool
    (beq
        ((pop(push(emptyStack)(id)))(snd)(True))
        (True)
    ), true);

    // pop returns predecessor stack
    assert.equals(pop(push(emptyStack)(id))(fst) === emptyStack, true);

    // returns head
    assert.equals(jsBool
    (beq
        ((head(push(emptyStack)(id)))(True))
        (True)
    ), true);
});

stackSuite.add("getElementByIndex with ChurchNumbers", assert => {
    assert.equals( getElementByIndex(emptyStack)(n0), id);

    assert.equals( getElementByIndex(stackWithNumbers)(n0), id);
    assert.equals( getElementByIndex(stackWithNumbers)(n1), 0);
    assert.equals( getElementByIndex(stackWithNumbers)(n2), 1);
    assert.equals( getElementByIndex(stackWithNumbers)(n3), 2);
    assert.equals( getElementByIndex(stackWithNumbers)(n4), 33);
    assert.equals( getElementByIndex(stackWithNumbers)(n5), 34);
    assert.equals( getElementByIndex(stackWithNumbers)(n6), 35);
});

stackSuite.add("getElementByIndex with JsNumber", assert => {
    assert.equals( getElementByIndex(emptyStack)(0), id);

    assert.equals( getElementByIndex(stackWithNumbers)(0), id);
    assert.equals( getElementByIndex(stackWithNumbers)(1), 0);
    assert.equals( getElementByIndex(stackWithNumbers)(2), 1);
    assert.equals( getElementByIndex(stackWithNumbers)(3), 2);
    assert.equals( getElementByIndex(stackWithNumbers)(4), 33);
    assert.equals( getElementByIndex(stackWithNumbers)(5), 34);
    assert.equals( getElementByIndex(stackWithNumbers)(6), 35);
});

stackSuite.add("getElementByIndex with not existing Index", assert => {

    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)(NaN),
        "getElementByIndex - TypError: index value 'NaN' (number) is not allowed. Use Js- or Church-Numbers");

    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)(Infinity),
        "getElementByIndex - TypError: index value 'Infinity' (number) is not allowed. Use Js- or Church-Numbers");

    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)("1"),
        "getElementByIndex - TypError: index value '1' (string) is not allowed. Use Js- or Church-Numbers");

    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)("blabla"),
        "getElementByIndex - TypError: index value 'blabla' (string) is not allowed. Use Js- or Church-Numbers");

    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)({}),
        "getElementByIndex - TypError: index value '[object Object]' (object) is not allowed. Use Js- or Church-Numbers");

    assert.consoleErrorEquals(        () => getElementByIndex(stackWithNumbers)([]),
        "getElementByIndex - TypError: index value '' (object) is not allowed. Use Js- or Church-Numbers");

    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)(-1),
        "getElementByIndex - TypError: index value '-1' (number) is not allowed. Use Js- or Church-Numbers");

    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)(9999), "invalid index");
    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)(7), "invalid index");
    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)(n7), "invalid index");
    assert.consoleErrorEquals(() => getElementByIndex(stackWithNumbers)(churchMultiplication(n7)(n7)), "invalid index");

    assert.consoleErrorEquals(() => getElementByIndex(emptyStack)(1), "invalid index");
    assert.consoleErrorEquals(() => getElementByIndex(emptyStack)(n1), "invalid index");
});

stackSuite.add("getElementByIndex with wrong stack value", assert => {

    assert.consoleErrorEquals(
        () => getElementByIndex("blabla")(1),
        "getElementByIndex - TypError: stack value 'blabla' (string) is not allowed. Use a Stack (type of function)");
    assert.consoleErrorEquals(
        () => getElementByIndex(42)(2),
        "getElementByIndex - TypError: stack value '42' (number) is not allowed. Use a Stack (type of function)");

    assert.consoleErrorEquals(
        () => getElementByIndex(42)(2),
        "getElementByIndex - TypError: stack value '42' (number) is not allowed. Use a Stack (type of function)");

    assert.consoleErrorEquals(
        () => getElementByIndex(True)(0),
        "getElementByIndex - TypError: stack value 'x => y => x' (function) is not a stack");
});

stackSuite.add("eitherElementByIndex", assert => {
    assert.equals( eitherElementByIndex(stackWithNumbers)(0)(id)(id), id);
    assert.equals( eitherElementByIndex(stackWithNumbers)(1)(id)(id), 0);
    assert.equals( eitherElementByIndex(stackWithNumbers)(2)(id)(id), 1);

    assert.equals( eitherElementByIndex(stackWithNumbers)(n1)(id)(id), 0);
    assert.equals( eitherElementByIndex(stackWithNumbers)(n2)(id)(id), 1);

    assert.equals( eitherElementByIndex(stackWithNumbers)(-1)(id)(id), "getElementByIndex - TypError: index value '-1' (number) is not allowed. Use Js- or Church-Numbers");
    assert.equals( eitherElementByIndex(stackWithNumbers)(n9)(id)(id), "invalid index");
    assert.equals( eitherElementByIndex(stackWithNumbers)("bla")(id)(id), "getElementByIndex - TypError: index value 'bla' (string) is not allowed. Use Js- or Church-Numbers");
});


stackSuite.add("reduce", assert => {
    const stackWithNumbers = nonEmptyStack;
    const stackWithChurchNumbers = push(push(push(emptyStack)(n9))(n2))(n3);

    const reduceFunctionSum = acc => curr => acc + curr;
    const reduceFunctionChurchNumbersSum = acc => curr => churchAddition(acc)(curr);
    const reduceToArray = acc => curr => [...acc, curr];

    assert.equals( reduce( reduceFunctionSum )(0)(stackWithNumbers), 3);
    assert.equals( reduce( reduceFunctionSum )(0)(push(stackWithNumbers)(3)), 6);
    assert.equals( reduce(acc => curr => acc + curr.income)(0)(personStack), 15000);
    assert.equals( jsNum( reduce( reduceFunctionChurchNumbersSum )(n0)(stackWithChurchNumbers)), 14);
    assert.arrayEquals(reduce(reduceToArray)([])(stackWithNumbers), [0, 1, 2]);
});

stackSuite.add("map", assert => {
    const stackWithNumbers = push(push(push(emptyStack)(10))(20))(30);
    const stackWithChurchNumbers = push(push(push(emptyStack)(n2))(n4))(n8);

    const multiplyWith2 = x => x * 2;
    const mapToJsnum = churchNum => jsNum(churchNum);

    const mappedStackWithNumbers = map(multiplyWith2)(stackWithNumbers);
    const mappedStackWithChurchNumbers = map(mapToJsnum)(stackWithChurchNumbers);

    assert.equals(head(mappedStackWithNumbers), 60);
    assert.equals(jsNum(size(mappedStackWithNumbers)), 3);
    assert.equals(head(pop(mappedStackWithNumbers)(fst)), 40);
    assert.equals(head(pop(pop(mappedStackWithNumbers)(fst))(fst)), 20);
    assert.equals(head(pop(pop(pop(mappedStackWithNumbers)(fst))(fst))(fst)), id);

    assert.equals(head(mappedStackWithChurchNumbers), 8);
    assert.equals(jsNum(size(mappedStackWithChurchNumbers)), 3);
    assert.equals(head(pop(mappedStackWithChurchNumbers)(fst)), 4);
    assert.equals(head(pop(pop(mappedStackWithChurchNumbers)(fst))(fst)), 2);
    assert.equals(head(pop(pop(pop(mappedStackWithChurchNumbers)(fst))(fst))(fst)), id);

    // map with emptystack
    assert.equals( map(id)(emptyStack), emptyStack )
});

stackSuite.add("filter", assert => {
    const filteredStackWithNumbers = filter(x => x < 35 && x > 2)(stackWithNumbers);
    const filteredStackWithLastNames = map(person => person.lastName)(filter(person => person.lastName.startsWith('S'))(personStack));
    const filteredStackWithIncome = filter(person => person.income > 5000)(personStack);

    assert.equals( jsNum(size(filteredStackWithNumbers)), 2);
    assert.equals( getElementByIndex(filteredStackWithNumbers)(0), id);
    assert.equals( getElementByIndex(filteredStackWithNumbers)(1), 33);
    assert.equals( getElementByIndex(filteredStackWithNumbers)(2), 34);
    assert.equals( jsNum(size(filteredStackWithLastNames)), 2);
    assert.equals( getElementByIndex(filteredStackWithLastNames)(0), id);
    assert.equals( getElementByIndex(filteredStackWithLastNames)(1), "Skywalker");
    assert.equals( getElementByIndex(filteredStackWithLastNames)(2), "Solo");
    assert.equals( jsNum(size(filteredStackWithIncome)), 0);
    assert.equals( head(filteredStackWithIncome), id);
    assert.equals( filteredStackWithIncome(stackPredecessor), id);
    assert.equals( filteredStackWithIncome, emptyStack);
});

stackSuite.add("startStack", assert => {
    const result = startStack(pushToStack)(2)(pushToStack)(3)(pushToStack)(4)(id);

    assert.equals( getElementByIndex(result)(0), id);
    assert.equals( getElementByIndex(result)(1), 2);
    assert.equals( getElementByIndex(result)(2), 3);
    assert.equals( getElementByIndex(result)(3), 4);
    assert.equals( jsNum(size(result)), 3);
});

stackSuite.add("reverse stack", assert => {
    const reversedStack = reverseStack(nonEmptyStack);

    assert.equals( getElementByIndex(reversedStack)(0), id);
    assert.equals( getElementByIndex(reversedStack)(1), 2);
    assert.equals( getElementByIndex(reversedStack)(2), 1);
    assert.equals( getElementByIndex(reversedStack)(3), 0);
    assert.equals( jsNum(size(reversedStack)), 3);
});

stackSuite.add("filter with reduce-function", assert => {
    const filteredStack = filterWithReduce(x => x >= 2 && x < 34)(stackWithNumbers);

    assert.equals( getElementByIndex(filteredStack)(0), id);
    assert.equals( getElementByIndex(filteredStack)(1), 2);
    assert.equals( getElementByIndex(filteredStack)(2), 33);
    assert.equals( jsNum(size(filteredStack)), 2);
});

stackSuite.add("map with reduce-function", assert => {
    const mappedStack = mapWithReduce(x => x * 3)(nonEmptyStack);

    assert.equals( getElementByIndex(mappedStack)(0), id);
    assert.equals( getElementByIndex(mappedStack)(1), 0);
    assert.equals( getElementByIndex(mappedStack)(2), 3);
    assert.equals( getElementByIndex(mappedStack)(3), 6);
    assert.equals( jsNum(size(mappedStack)), 3);
});

stackSuite.add("convert stack to array", assert => {
    const result = convertStackToArray(stackWithNumbers);

    assert.equals(result.length, 6);
    assert.arrayEquals(result, [0, 1, 2, 33, 34, 35]);
});

stackSuite.add("convert array to stack", assert => {
    const result = convertArrayToStack([1, 2, 3]);

    assert.equals( jsNum(size(result)), 3);
    assert.equals( getElementByIndex(result)(0), id);
    assert.equals( getElementByIndex(result)(1), 1);
    assert.equals( getElementByIndex(result)(2), 2);
    assert.equals( getElementByIndex(result)(3), 3);

    const result2 = convertArrayToStack([]);

    assert.equals(jsNum(size(result2)), 0);
    assert.equals(getElementByIndex(result2)(0), id);
    assert.equals(result2, emptyStack);
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

stackSuite.add("performance test: for/foreach loop - stack implementation", assert => {
    const testStack = createTestStackWithNElements(200)

    const callbackFunc = (elem, i) => {
        //console.log(`elem: ${elem}, index: ${i}`);
    }

    const result = BenchmarkTest('for/foreach loop - stack implementation')(() =>  forEach(testStack)(callbackFunc));
});

stackSuite.add("performance test: for/foreach loop - old stack implementation", assert => {

    const testStack = createTestStackWithNElements(200);
    const callbackFunc = (elem, i) => {
        //console.log(`elem: ${elem}, index: ${i}`);
    }

    const result = BenchmarkTest('for/foreach loop - old stack implementation')(() => forEachOld(testStack)(callbackFunc));
});

stackSuite.add("removeByIndex", assert => {
    const elements = convertArrayToStack(["Hello", "Haskell", "you", "Rock", "the", "World"]);
    const result = removeByIndex(elements)(2) // "Haskell"

    assert.arrayEquals(convertStackToArray(result), ["Hello", "you", "Rock", "the", "World"]);
    assert.churchNumberEquals(size(result), n5);

    const resultEndIndex = removeByIndex(result)(5) // "World"
    assert.arrayEquals(convertStackToArray(resultEndIndex), ["Hello", "you", "Rock", "the"]);
    assert.churchNumberEquals(size(resultEndIndex), n4);

    const resultStartIndex = removeByIndex(resultEndIndex)(1) // "Hello"
    assert.arrayEquals(convertStackToArray(resultStartIndex), ["you", "Rock", "the"]);
    assert.churchNumberEquals(size(resultStartIndex), n3);


    const resultToEmptyStack = removeByIndex(removeByIndex(removeByIndex(resultStartIndex)(1))(1))(1)
    assert.arrayEquals(convertStackToArray(resultToEmptyStack), []);
    assert.churchNumberEquals(size(resultToEmptyStack), n0);

    const resultEmpty = removeByIndex(emptyStack)(4)
    assert.arrayEquals(convertStackToArray(resultEmpty), []);
    assert.churchNumberEquals(size(resultEmpty), n0);

    const resultNotAvailableIndex = removeByIndex(elements)(42) // not existing Index
    assert.arrayEquals(convertStackToArray(resultNotAvailableIndex), ["Hello", "Haskell", "you", "Rock", "the", "World"]);
    assert.churchNumberEquals(size(resultNotAvailableIndex), n6);

    // same with ChurchNumbers
    const resultEndIndexCN = removeByIndex(result)(n5) // "World"
    assert.arrayEquals(convertStackToArray(resultEndIndexCN), ["Hello", "you", "Rock", "the"]);
    assert.churchNumberEquals(size(resultEndIndexCN), n4);

    const resultStartIndexCN = removeByIndex(resultEndIndexCN)(n1) // "Hello"
    assert.arrayEquals(convertStackToArray(resultStartIndexCN), ["you", "Rock", "the"]);
    assert.churchNumberEquals(size(resultStartIndexCN), n3);

    const resultToEmptyStackCN = removeByIndex(removeByIndex(removeByIndex(resultStartIndex)(n1))(n1))(n1)
    assert.arrayEquals(convertStackToArray(resultToEmptyStackCN), []);
    assert.churchNumberEquals(size(resultToEmptyStackCN), n0);

    const resultEmptyCN = removeByIndex(emptyStack)(n4)
    assert.arrayEquals(convertStackToArray(resultEmptyCN), []);
    assert.churchNumberEquals(size(resultEmptyCN), n0);

    const resultNotAvailableIndexCN = removeByIndex(elements)(n9) // not existing Index
    assert.arrayEquals(convertStackToArray(resultNotAvailableIndexCN), ["Hello", "Haskell", "you", "Rock", "the", "World"]);
    assert.churchNumberEquals(size(resultNotAvailableIndexCN), n6);
});

stackSuite.add("concat", assert => {
    const elements  = convertArrayToStack(["Hello", "Haskell"]);
    const elements2 = convertArrayToStack(["World", "Random"]);

    // tests neutral element
    const result1 = concat(elements)(emptyStack);
    const result2 = concat(emptyStack)(elements);

    assert.equals(result1, result2);

    assert.equals(jsNum(size(result1)), 2);
    assert.equals(getElementByIndex(result1)(0), id);
    assert.equals(getElementByIndex(result1)(1), "Hello");
    assert.equals(getElementByIndex(result1)(2), "Haskell");

    // normal concat test
    const result3 = concat(elements)(elements2);

    assert.equals( jsNum(size(result3)), 4);
    assert.equals( getElementByIndex(result3)(0), id);
    assert.equals( getElementByIndex(result3)(1), "Hello");
    assert.equals( getElementByIndex(result3)(2), "Haskell");
    assert.equals( getElementByIndex(result3)(3), "World");
    assert.equals( getElementByIndex(result3)(4), "Random");

    const s1 = convertArrayToStack([1, 2]);
    const s2 = convertArrayToStack([3, 4]);
    const s3 = convertArrayToStack([5, 6]);

    // tests associativity
    const r1 = concat(concat(s1)(s2))(s3);   // ( s1 (+) s2 )  (+) s3
    const r2 = concat(s1)(concat(s2)(s3));  // s1 (+) ( s2 (+) s3 )

    assert.equals( jsNum(size(r1)), 6);
    assert.equals( getElementByIndex( r1 )(0), id);
    assert.equals( getElementByIndex( r1 )(1), 1);
    assert.equals( getElementByIndex( r1 )(2), 2);
    assert.equals( getElementByIndex( r1 )(3), 3);
    assert.equals( getElementByIndex( r1 )(4), 4);
    assert.equals( getElementByIndex( r1 )(5), 5);
    assert.equals( getElementByIndex( r1 )(6), 6);

    assert.equals( jsNum(size(r2)), 6);
    assert.equals( getElementByIndex( r2 )(0), id);
    assert.equals( getElementByIndex( r2 )(1), 1);
    assert.equals( getElementByIndex( r2 )(2), 2);
    assert.equals( getElementByIndex( r2 )(3), 3);
    assert.equals( getElementByIndex( r2 )(4), 4);
    assert.equals( getElementByIndex( r2 )(5), 5);
    assert.equals( getElementByIndex( r2 )(6), 6);

    const s4 = convertArrayToStack([1, 2, 3]);
    const s5 = convertArrayToStack([4, 5]);

    const r3 = concat(s4)(s5);

    assert.equals( jsNum(size(r3)), 5);
    assert.equals( getElementByIndex(r3)(0), id);
    assert.equals( getElementByIndex(r3)(1), 1);
    assert.equals( getElementByIndex(r3)(2), 2);
    assert.equals( getElementByIndex(r3)(3), 3);
    assert.equals( getElementByIndex(r3)(4), 4);
    assert.equals( getElementByIndex(r3)(5), 5);

});

stackSuite.add("flatten", assert => {
    const s1 = convertArrayToStack([1, 2]);
    const s2 = convertArrayToStack([3, 4]);
    const s3 = convertArrayToStack([5, 6]);

    const stackWithStacks = convertArrayToStack([s1, s2, s3]);

    assert.equals(jsNum(size(stackWithStacks)), 3);
    assert.equals(getElementByIndex(stackWithStacks)(0), id);
    assert.equals(getElementByIndex(stackWithStacks)(1), s1);
    assert.equals(getElementByIndex(stackWithStacks)(2), s2);
    assert.equals(getElementByIndex(stackWithStacks)(3), s3);

    const r1 = flatten(stackWithStacks);

    assert.equals(jsNum(size(r1)), 6);
    assert.equals(getElementByIndex(r1)(0), id);
    assert.equals(getElementByIndex(r1)(1), 1);
    assert.equals(getElementByIndex(r1)(2), 2);
    assert.equals(getElementByIndex(r1)(3), 3);
    assert.equals(getElementByIndex(r1)(4), 4);
    assert.equals(getElementByIndex(r1)(5), 5);
    assert.equals(getElementByIndex(r1)(6), 6);
});

stackSuite.add("zip", assert => {
    const s1 = convertArrayToStack([1, 2]);
    const s2 = convertArrayToStack([3, 4]);

    const zippedStack = zip(s1)(s2);

    assert.equals(jsNum(size(zippedStack)), 2);
    assert.equals(getElementByIndex(zippedStack)(0), id);
    assert.pairEquals(getElementByIndex(zippedStack)(1), pair(1)(3));
    assert.pairEquals(getElementByIndex(zippedStack)(2), pair(2)(4));

    const s3 = convertArrayToStack([1, 2]);
    const s4 = convertArrayToStack([3]);

    const zippedStack2 = zip(s3)(s4);

    assert.equals(jsNum(size(zippedStack2)), 1);
    assert.equals(getElementByIndex(zippedStack2)(0), id);
    assert.pairEquals(getElementByIndex(zippedStack2)(1), pair(1)(3));

    const s5 = convertArrayToStack([2]);
    const s6 = convertArrayToStack([4, 5]);

    const zippedStack3 = zip(s5)(s6);

    assert.equals(jsNum(size(zippedStack3)), 1);
    assert.equals(getElementByIndex(zippedStack3)(0), id);
    assert.pairEquals(getElementByIndex(zippedStack3)(1), pair(2)(4));

    const zipped = zip(convertArrayToStack([]))(convertArrayToStack([1, 2]));

    assert.equals(jsNum(size(zipped)), 0);
    assert.equals(getElementByIndex(zipped)(0), id);

    const zipped2 = zip(convertArrayToStack([1, 2]))(convertArrayToStack([]));

    assert.equals(jsNum(size(zipped2)), 0);
    assert.equals(getElementByIndex(zipped2)(0), id);

    const zipped3 = zip(emptyStack)(emptyStack);

    assert.equals(jsNum(size(zipped3)), 0);
    assert.equals(getElementByIndex(zipped3)(0), id);

    const zipped4 = zip(emptyStack)(convertArrayToStack([1,2,3]));

    assert.equals(jsNum(size(zipped4)), 0);
    assert.equals(getElementByIndex(zipped4)(0), id);
});

stackSuite.add("zipWith", assert => {
    const add = x => y => x + y;
    const s1 = convertArrayToStack([1, 2, 3]);
    const s2 = convertArrayToStack([4, 5, 6]);

    const zippedStack = zipWith(add)(s1)(s2);

    assert.equals(jsNum(size(zippedStack)), 3);
    assert.equals(getElementByIndex(zippedStack)(0), id);
    assert.equals(getElementByIndex(zippedStack)(1), 5);
    assert.equals(getElementByIndex(zippedStack)(2), 7);
    assert.equals(getElementByIndex(zippedStack)(3), 9);

    const s3 = convertArrayToStack([1, 2]);
    const s4 = convertArrayToStack([3]);

    const zippedStack2 = zipWith(add)(s3)(s4);

    assert.equals(jsNum(size(zippedStack2)), 1);
    assert.equals(getElementByIndex(zippedStack2)(0), id);
    assert.equals(getElementByIndex(zippedStack2)(1), 4);

    const s5 = convertArrayToStack([2]);
    const s6 = convertArrayToStack([4, 5]);

    const zippedStack3 = zipWith(add)(s5)(s6);

    assert.equals(jsNum(size(zippedStack3)), 1);
    assert.equals(getElementByIndex(zippedStack3)(0), id);
    assert.equals(getElementByIndex(zippedStack3)(1), 6);
});

stackSuite.add("stackEquals", assert => {
    const s1 = convertArrayToStack([1, 2, 3]);
    const s2 = convertArrayToStack([1, 2, 4]);
    const r1 = stackEquals(s1)(s2)
    assert.churchBooleanEquals(r1, False);

    const s3 = convertArrayToStack([1, 2, 3]);
    const s4 = convertArrayToStack([1, 2, 3]);
    const r2 = stackEquals(s3)(s4)
    assert.churchBooleanEquals(r2, True);

    const s5 = convertArrayToStack([0, 2, 3]);
    const s6 = convertArrayToStack([1, 2, 3]);
    const r3 = stackEquals(s5)(s6)
    assert.churchBooleanEquals(r3, False);

    const r4 = stackEquals(emptyStack)(emptyStack)
    assert.churchBooleanEquals(r4, True);

    const s9 = convertArrayToStack([0]);
    const s10 = convertArrayToStack([1]);
    const r5 = stackEquals(s9)(s10)
    assert.churchBooleanEquals(r5, False);

    const s11 = convertArrayToStack([1]);
    const s12 = convertArrayToStack([1]);
    const r6 = stackEquals(s11)(s12)
    assert.churchBooleanEquals(r6, True);

    const s13 = convertArrayToStack([1, 2, 3]);
    const s14 = convertArrayToStack([1, 2]);
    const r7 = stackEquals(s13)(s14)
    assert.churchBooleanEquals(r7, False);

    const s15 = convertArrayToStack([1, 2]);
    const s16 = convertArrayToStack([1, 2, 3]);
    const r8 = stackEquals(s15)(s16)
    assert.churchBooleanEquals(r8, False);
});

stackSuite.add("maybe-/getIndexOfElement ", assert => {
    const stackWithNumbers = convertArrayToStack([0, 11, 22, 33]);

    assert.equals( maybeIndexOfElement(stackWithNumbers)(-1), Nothing)
    assert.equals( getIndexOfElement(stackWithNumbers)(-1), undefined)
    assert.churchNumberEquals( getIndexOfElement(stackWithNumbers)(0), n1)
    assert.churchNumberEquals( maybeIndexOfElement(stackWithNumbers)(0)("not found")(id), n1)
    assert.churchNumberEquals( getIndexOfElement(stackWithNumbers)(11),n2)
    assert.churchNumberEquals( getIndexOfElement(stackWithNumbers)(22),n3)
    assert.churchNumberEquals( getIndexOfElement(stackWithNumbers)(33),n4)
    assert.equals( getIndexOfElement(stackWithNumbers)(44), undefined)


    const stackWithStrings = convertArrayToStack(["a", "b", "c"]);

    assert.churchNumberEquals( getIndexOfElement(stackWithStrings)("a"), n1)
    assert.churchNumberEquals( getIndexOfElement(stackWithStrings)("b"), n2)
    assert.churchNumberEquals( getIndexOfElement(stackWithStrings)("c"), n3)
    assert.equals( getIndexOfElement(stackWithStrings)("xx"), undefined)
});

stackSuite.add("containsElement ", assert => {
    const stackWithNumbers = convertArrayToStack([0, 11, 22, 33]);

    assert.churchBooleanEquals( containsElement(stackWithNumbers)(-1), False)
    assert.churchBooleanEquals( containsElement(stackWithNumbers)(0), True)
    assert.churchBooleanEquals( containsElement(stackWithNumbers)(11),True)
    assert.churchBooleanEquals( containsElement(stackWithNumbers)(22),True)
    assert.churchBooleanEquals( containsElement(stackWithNumbers)(33),True)
    assert.churchBooleanEquals( containsElement(stackWithNumbers)(44), False)

    const stackWithStrings = convertArrayToStack(["a", "b", "c"]);

    assert.churchBooleanEquals( containsElement(stackWithStrings)("a"), True)
    assert.churchBooleanEquals( containsElement(stackWithStrings)("b"), True)
    assert.churchBooleanEquals( containsElement(stackWithStrings)("c"), True)
    assert.churchBooleanEquals( containsElement(stackWithStrings)("xx"), False)
});

stackSuite.report();
