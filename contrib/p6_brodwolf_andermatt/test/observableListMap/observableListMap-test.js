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

const observableListMapSuite = TestSuite("Observable Pattern with ListMap (pure functional data structure)");


observableListMapSuite.add("addListener", assert => {

    const testObsListMap = InitObservable(0)
    (addListener)()

    assert.equals(convertToJsBool(hasPre(emptyListMap)), false);

});

observableListMapSuite.report();
