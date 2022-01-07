import {emptyListMap, removeByKey} from "../listMap/listMap.js";
import {push, forEach} from "../stack/stack.js";
import {pair, showPair, snd, fst} from "../lambda-calculus-library/lambda-calculus.js";
import {generateRandomKey} from "./observableExamples/observableUtilities.js";
export {Observable, addListener, setValue, getValue, removeListenerByKey, removeListener, logListenersToConsole, listenerLogToConsole, newListener, setListenerKey, getListenerKey, newListenerWithCustomKey, listenerNewValueToDomElementTextContent, listenerOldValueToDomElementTextContent, listenerNewValueLengthToElementTextContent, listenerNewValueToElement}

/**
 * Generic Types
 * @typedef {function} observable
 * @typedef {function} listener
 * @typedef {function} listMap
 * @typedef {function} observableBody
 */

/**
 * listeners -> value -> observableFunction -> observableFunction ;
 * observableBody is the Body-Observable-Construct for the observableFunctions.
 * observableFunctions are: {@link addListener}, {@link removeListener}, {@link removeListenerByKey}, {@link setValue}
 *
 * @haskell observableBody :: [a] -> b -> c -> c
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(obsFn:function): function(obsFn:function)} a Observable-Function
 */
const observableBody = listeners => value => obsFn =>
    obsFn(listeners)(value)

/**
 * initialValue -> observableBody ;
 * Observable - create new Observable incl. the initial-value
 *
 * @haskell Observable :: a -> Observable
 * @function
 * @param  {number|churchNumber|string} initialValue
 * @return {observableBody} - a Observable with an emptyListMap & the InitialValue
 * @example
 * const obsExample = Observable(0)
 *                          (addListener)( listenerLogToConsole      )
 *                          (addListener)( listenerNewValueToElement )
 */
const Observable = initialValue =>
    observableBody(emptyListMap)(initialValue)(setValue)(initialValue);

/**
 * listeners -> oldValue -> newValue -> Observable ;
 * set the new value and notify all listeners
 *
 * @extends observableBody
 * @haskell setValue :: [a] -> b -> b -> Observable
 * @function
 * @param  {listMap} listeners
 * @return {function(oldValue:*): function(newValue:*): observableBody} {@link observableBody}
 * @example
 * let obsExample = Observable(0)
 * testObs(getValue) === 0
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const setValue = listeners => oldValue => newValue => {
    forEach(listeners)((listener, _) => (listener(snd))(newValue)(oldValue));
    return observableBody(listeners)(newValue);
}

/**
 * listeners -> value -> value ;
 * get the value of Observable
 *
 * @extends observableBody
 * @haskell getValue :: [a] -> b -> b
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(value:*)}
 * @example
 * let obsExample = Observable(0)
 * testObs(getValue) === 0
 *
 * testObs = testObs(setValue)(42)
 * testObs(getValue) === 42
 */
const getValue = listeners => value => value;

/**
 * listeners -> value -> newListener -> Observable ;
 * Add a new listener to the observable and the current observable value is immediately sendet to the listener.
 *
 * @haskell addListener :: [a] -> b -> [a] -> Observable
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(newListener:listMap): observableBody} {@link observableBody}
 * @example
 * const obsExample = Observable(0)
 *                          (addListener)( listenerLogToConsole      )
 *                          (addListener)( listenerNewValueToElement )
 */
const addListener = listeners => value => newListener => {
    newListener(snd)(value)(value)
    return observableBody(push(listeners)(newListener))(value);
}

/**
 * listeners -> value -> listenerKey ;
 * Remove a Listener by his key
 *
 * @extends observableBody
 * @haskell removeListenerByKey :: [a] -> b -> c
 * @function
 * @param  {listMap} listeners
 * @return {function(value:*): function(listenerKey:*)} {@link observableBody}
 * @example
 * let observedObject = {};
 * const listenerValue = newListenerWithCustomKey( 42 )( listenerNewValueToElement (valueHolder) );
 *
 * let obsExample = Observable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 * obsExample = obsExample(setValue)(11)
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListenerByKey)(42) // 'listenerValue' is removed as listener
 *
 * obsExample = obsExample(setValue)(66)
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
 */
const removeListenerByKey = listeners => value => listenerKey =>
    observableBody(removeByKey(listeners)(listenerKey))(value);

/**
 * listeners -> value -> givenListener ;
 * Remove a Listener by Listener
 *
 * @extends observableBody
 * @haskell removeListenerByKey :: [a] -> b -> c
 * @function
 * @param {listMap} listeners
 * @return {function(value:*): function(givenListener:listener)} {@link observableBody}
 * @example
 * let observedObject = {};
 * const listenerValue = newListener( listenerNewValueToElement (observedObject) );
 *
 * let obsExample = Observable(0)
 *                      (addListener)(listenerValue)
 *
 * observedObject.value === 0  // variable "observedObject" get updated from InitialValue
 *
 * obsExample = obsExample(setValue)(11)
 *
 * observedObject.value === 11  // variable "observedObject" get updated
 *
 * obsExample = obsExample(removeListener)(listenerValue)
 *
 * obsExample = obsExample(setValue)(66)
 *
 * observedObject.value === 11  // variable "observedObject" getting no updates anymore
 */
const removeListener = listeners => value => givenListener =>
    observableBody(removeByKey(listeners)(givenListener(fst)))(value);

/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. (Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {*} key
 * @return {function(listenerFn:function) : listener} new listener with custom key for the observable
 * @example
 * const listenerLog = newListenerWithCustomKey(42)(listenerLogToConsole);
 */
const newListenerWithCustomKey = key => listenerFn => pair(key)(listenerFn);

/**
 * Syntactic sugar for creating a pair of Key and Value for the new Listener.
 * The key could be anything that can be comparable. The 'generateRandomKey' generate String with the length of six with random Letters (up-/lowercase) & Numbers.
 * The listenerFn takes two arguments "newValue" and "oldValue" from the the observable. Some Listener-Function are available and ready to use.
 *
 * @function
 * @param  {function} listenerFn
 * @return {listener} new listener with generated key for the observable
 * @example
 * let listenerLogTest = newListener(listenerLogToConsole);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const newListener = listenerFn => pair(generateRandomKey())(listenerFn);

/**
 * Set a new Key for the listener.
 *
 * @function
 * @param  {*} newKey
 * @return {function(listener:function) : listener} listener with the key
 * @example
 * let listenerLogTest = newListener(listenerLogToConsole);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const setListenerKey = newKey => listener => pair(newKey)(listener(snd));

/**
 * Get the key of a listener
 *
 * @function
 * @param  {listener} listener
 * @return {*} key
 * @example
 * let listenerLogTest = newListener(listenerLogToConsole);
 *
 * listenerTest = setListenerKey(42)(listenerTest)
 *
 * getListenerKey(listenerTest) === 42)
 */
const getListenerKey = listener => listener(fst);

/**
 * The logListenersToConsole function is passed as a parameter of an observable and performs a side effect.
 * The site effect logs all listeners of the observable with their keys and values on the console. * @sideeffect
 *
 * @extends observableBody
 * @function
 */
const logListenersToConsole = listeners => _ =>
    forEach(listeners)((element, index) => console.log( 'element at: ' + index + ': ' + showPair(typeof (element) === 'object' ? JSON.stringify(element) : element) ));

/*
    Listener-Functions
 */
const listenerLogToConsole                        =            nVal => oVal => console.log(`Value: new = ${nVal}, old = ${oVal}`);
const listenerNewValueToElement                   = element => nVal => oVal => element.value = nVal;
const listenerNewValueToDomElementTextContent     = element => nVal => oVal => element.textContent = nVal;
const listenerOldValueToDomElementTextContent     = element => nVal => oVal => element.textContent = oVal;
const listenerNewValueLengthToElementTextContent  = element => nVal => oVal => element.textContent = nVal.length;
