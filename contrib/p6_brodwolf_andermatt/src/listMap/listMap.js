import {id, pair, fst, snd, If, Else, Then, triple} from "../lambda-calculus-library/lambda-calculus.js";
import {n0} from "../lambda-calculus-library/church-numerals.js";
import {size, stackPredecessor, head, reverseStack, hasPre, getPreStack, push, map, filter, reduce, forEach, emptyStack} from "../stack/stack.js";
export {listMap, emptyListMap, getElementByKey, removeByKey, startListMap, mapListMap, filterListMap, reduceListMap, convertObjToListMap, logListMapToConsole, convertListMapToArray, convertListMapToStack}

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {function} listMap
 */

/**
 * index -> predecessor -> pair -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The listMap is a pure functional data structure and is therefore immutable.
 * The listMap is implemented as a stack aka triplet.
 * So the listMap have all the features and functionality that have the stack too.
 *
 * The first value of the listMap represents the size (number of elements) of the listMap.
 * At the same time the first value represents the index of the head (top value) of the listMap.
 * The second value represents the predecessor listMap
 * The third value represents the head ( top value ) of the listMap
 *
 * @type {function(index:churchNumber): function(predecessor:stack):  function(value:*): function(f:function): ({f: {index value head}}) }
 * @return {triple} listMap as triple aka stack
 */
const listMap = triple;

/**
 * Representation of the empty stack
 * The empty listMap has the size/index zero (has zero elements).
 * The empty listMap has no predecessor stack, but the identity function as placeholder.
 * The empty listMap has no head ( top value ), but a pair of two identity functions as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyListMap = listMap(n0)(id)( pair(id)(id) );

/**
 * A help function to create a new listMap
 */
const startListMap = f => f(emptyListMap);

/**
 * This function takes a map function (like JavaScript Array map) and a listMap. The function returns a new listMap with the "mapped" values.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const toUpperCase      = str => str.toUpperCase();
 * const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans"});
 *
 * const mappedListMap    = mapListMap(toUpperCase)(listMapWithNames); // [ ("name1", "PETER"), ("name2", "HANS") ]
 *
 * getElementByKey( mappedListMap )( "name1" ) // "PETER"
 * getElementByKey( mappedListMap )( "name2" )  // "HANS"
 */
const mapListMap = f => map(p => pair( p(fst) )( f(p(snd)) ));

/**
 * This function takes a filter function (like JavaScript Array filter) and a listMap. The function returns the filtered listMap. If no elements match the filter, the empty listMap is returned.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans", name3: "Paul"});
 *
 * const filteredListMap  = filterListMap(str => str.startsWith('P'))(listMapWithNames); // [ ("name1", "Peter"), ("name3", "Paul") ]
 *
 * getElementByKey(filteredListMap)("name1");  // "Peter"
 * getElementByKey(filteredListMap)("name3");  // "Paul"
 */
const filterListMap = f => filter(p => f(p(snd)) );

/**
 * This function takes a reduce function first, a start value second and a ListMap as the last parameter. The function returns the reduced value.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const reduceFunc = acc => curr => acc + curr.income;
 * const employees = convertObjToListMap({ p1: {firstName: 'Peter',  income: 1000},
 *                                         p2: {firstName: 'Michael', income: 500} });
 *
 * reduceListMap(reduceFunc)(0)(employees); // 1500
 */
const reduceListMap = f => reduce(acc => curr => f(acc)(curr(snd)));

/**
 * Takes a JavaScript object and convert the key and values analog into a listMap
 *
 * @param  {object} obj
 * @return {listMap}
 * @example
 * const obj = {a: 'Hello', b: "Lambda"}
 *
 * const listMapEx = convertObjToListMap(obj);
 *
 * size(listMapEx)               // n2
 * getElementByIndex(result)(n1) // pair('a')("Hello"));
 * getElementByIndex(result)(n2) // pair('b')("Lambda"));
 */
const convertObjToListMap = obj => Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);

/**
 * Get the element in the ListMap by the key (key could be anything that can be comparable. Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 *
 * @function
 * @param  {listMap} listMap
 * @return {function(key:Number): *} element (value) or id if key not exist
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * getElementByKey( testListMap )( 1 ) === "Hans"
 * getElementByKey( testListMap )( 2 ) === "Peter"
 * getElementByKey( testListMap )( 3 ) === 42
 */
const getElementByKey = listMap => key => {
    const times         = size(listMap); // TODO: successor of size
    const initArgsPair  = pair(listMap)(id); // TODO: set to undefined

    const getElement = argsPair => {
        const stack             = argsPair(fst);
        const predecessorStack  = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);

      return (currentKeyValPair(fst) === key)
        ? pair(predecessorStack)( currentKeyValPair(snd) )
        : pair(predecessorStack)( argsPair(snd)          );
    };

    return (times(getElement)(initArgsPair))(snd);
};

/**
 * Remove the element in the ListMap by the key (key could be anything that can be comparable. Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 *
 * @function
 * @param  {listMap} listMap
 * @return {function(key:*): *} element (value)
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * jsnum( size(testListMap) ) === 3
 *
 * const listMapOneRemoved = removeByKey(testListMap)(1)
 * jsnum( size(listMapOneRemoved) ) === 2
 */
const removeByKey = listMap => key => {
    const times         = size(listMap);
    const reversedStack = reverseStack(listMap);

    const removeByCon = currentStack => resultStack => key => {
        const currentKeyValPair = head(currentStack);
        const currentElement    = currentKeyValPair(snd);
        const currentKey        = currentKeyValPair(fst);
        const result            = key === currentKey
                                       ? resultStack
                                       : push( resultStack )( pair(currentKey)(currentElement) );

        return pair( getPreStack(currentStack) )( result );
    }

    const iteration = argsPair =>
        If( hasPre(argsPair(fst)) )
            (Then( removeByCon(argsPair(fst))(argsPair(snd))(key) ))
            (Else( argsPair ));


    return (times
                (iteration)
                (pair(reversedStack)(emptyListMap) )
            )(snd);
}

/**
 *  A function that takes an ListMap, takes the values (ignore the keys) and converts it into an array and returns the array.
 *
 * @param  {listMap} listMap
 * @return {Array} Array
 * @example
 * const personObject  = {firstName: "George", lastName: "Lucas"}
 *
 * const personListMap = convertListMapToArray(personObject); // [ ("firstName", "George"), ("lastName","Lucas") ]
 *
 * convertListMapToArray( personListMap ) // [ "George", "Lucas" ]
 */
const convertListMapToArray = listMap => reduceListMap(acc => curr => [...acc, curr])([])(listMap);

/**
 *  A function that takes an ListMap, takes the values (ignore the keys) and converts it into an array and returns the array.
 *
 * @param  {listMap} listMap
 * @return {Array} Array
 * @example
 * const personObject = {firstName: "George", lastName: "Lucas"}
 *
 * const result = convertObjToListMap( personObject ); // [ ("firstName", "George"), ("lastName","Lucas") ]
 *
 * getElementByKey( result )( "firstName" );  // "George"
 * getElementByKey( result )( "lastName"  );  // "Lucas"
 */
const convertListMapToStack = listMap => reduceListMap(acc => curr => push(acc)(curr))(emptyStack)(listMap);

/**
 * The logListMapToConsole function takes a ListMap and executes a site effect. The site effect logs the ListMap with its key and values to the console.
 *
 * @sideeffect
 * @function
 * @param {listMap} listMap
 */
const logListMapToConsole = listMap =>
    forEach(listMap)((element, index) => console.log(`Index ${index} (Key, Element): (${JSON.stringify(element(fst))}, ${JSON.stringify(element(snd))})` ));
