import {id, True, False, jsBool, pair, triple, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, not, and, If, Then, Else, churchBool, LazyIf} from '../lambda-calculus-library/lambda-calculus.js'
import {eitherFunction, Left, Right, Just, Nothing, eitherTryCatch, eitherNotNullAndUndefined, eitherNaturalNumber} from "../maybe/maybe.js";
import {n0, n1, succ, jsNum, is0,  leq, eq, churchSubtraction, churchNum, min,} from '../lambda-calculus-library/church-numerals.js'
export {stack, stackIndex, stackPredecessor, stackValue, emptyStack, hasPre, push, pop, head, size, reduce, filter, map, getElementByIndex, logStackToConsole, startStack, pushToStack, reverseStack, filterWithReduce, mapWithReduce, convertStackToArray, convertArrayToStack, convertElementsToStack, forEach, forEachOld, removeByIndex, getPreStack, concat, flatten, zip, zipWith, stackEquals, getIndexOfElement, containsElement, maybeIndexOfElement, eitherElementByIndex, eitherElementByJsNumIndex, eitherElementByChurchIndex, getElementByChurchNumberIndex, getElementByJsNumIndex}

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} stack
 * @typedef {function} stackOp
 * @typedef {function} maybe
 * @typedef {function} either
 * @typedef {function} churchNumber
 * @typedef {number}   jsNumber
 */

/**
 * index -> predecessor -> value -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 *
 * @function
 * @type stack
 * @return {triple} stack as triple
 */
const stack = triple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @function
 * @type stack
 * @return {stack} emptyStack
 */
const emptyStack = stack(n0)(id)(id);

/**
 * A help function to create a new stack
 *
 * @function
 * @param  {function} f
 * @return {stack} stack
 */
const startStack = f => f(emptyStack);

/**
 * stack getter function - get the Index (first of a triple)
 *
 * @haskell stackIndex :: a -> b -> c -> a
 * @function
 * @return {churchNumber} index/size
 * @example
 * stack(n0)(emptyStack)(42)(stackIndex) === n0
 */
const stackIndex = firstOfTriple;

/**
 * stack getter function - get the Predecessor (second of a triple)
 *
 * @haskell stackPredecessor :: a -> b -> c -> b
 * @function
 * @return {stack|id} predecessor stack or id if emptyStack
 * @example
 * stack(n0)(emptyStack)(42)(stackPredecessor) === emptyStack
 */
const stackPredecessor = secondOfTriple;

/**
 * stack getter function - get the Value (third of a triple)
 *
 * @haskell stackValue :: a -> b -> c -> c
 * @function
 * @return {*} value
 * @example
 * stack(n0)(emptyStack)(42)(stackValue) === 42
 */
const stackValue = thirdOfTriple;

/**
 * A function that takes a stack and returns a church-boolean, which indicates whether the stack has a predecessor stack
 *
 * @haskell: hasPre :: a -> churchBoolean
 * @function hasPredecessor
 * @param  {stack} s
 * @return {churchBoolean} churchBoolean
 */
const hasPre = s => not(is0(s(stackIndex)));

/**
 * A function that takes a stack and returns the predecessor stack
 *
 * @haskell getPreStack :: stack -> stack
 * @function getPredecessorStack
 * @param  {stack} s
 * @return {stack} predecessor stack of that stack
 */
const getPreStack = s => s(stackPredecessor)

/**
 * A function that takes a stack and a value.
 * The function returns a new stack with the pushed value.
 *
 * @haskell push :: stack -> a -> stack
 * @param  {stack} s
 * @return {stack} stack with value x
 */
const push = s => stack(succ(s(stackIndex)))(s);

/**
 * A function that takes a stack and returns a value pair.
 * The first element of the pair is the predecessor stack.
 * The second element of the pair is the head (the top element) of the stack.
 *
 * @haskell pop :: stack -> pair
 * @param  {stack} s
 * @return {pair} pair
 */
const pop = s => pair(getPreStack(s))(head(s));

/**
 * A function that takes a stack. The function returns the head (the top value) of the stack.
 *
 * @haskell head :: stack -> a
 * @function
 * @param  {stack} s
 * @return {*} stack-value
 */
const head = s => s(stackValue);

/**
 * A function that takes a stack. The function returns the index (aka stack-size) of the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param  {stack} s
 * @return {churchNumber} stack-index as church numeral
 */
const getStackIndex = s => s(stackIndex);

/**
 * A function that takes a stack and returns the size (number of elements) in the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param  {stack} s
 * @return {churchNumber} size (stack-index) as church numeral
 */
const size = getStackIndex;

/**
 * A function that takes a reduce-function, the initial reduce value and a stack.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @haskell reduce :: reduceFn ->initialValue -> stack -> a
 * @function
 * @param  {function} reduceFn
 * @return {function(initialValue:*): function(s:stack): function(stack)} reduced value
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * const reduceFunctionSum = acc => curr => acc + curr;
 * reduce( reduceFunctionSum )( 0 )( stackWithNumbers )          ===  3
 * reduce( reduceFunctionSum )( 0 )( push(stackWithNumbers)(3) ) ===  5
 *
 * reduce( reduceFunctionSum )( 5 )( stackWithNumbers )          ===  8
 * reduce( reduceFunctionSum )( 5 )( push(stackWithNumbers)(3) ) === 10
 *
 * const reduceToArray = acc => curr => [...acc, curr];
 * reduce( reduceToArray )( [] )( stackWithNumbers ) === [0, 1, 2]
 */
const reduce = reduceFn => initialValue => s => {

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction    = argsTriple(secondOfTriple);
            const preAcc            = argsTriple(thirdOfTriple);
            const curr              = head(stack);
            const acc               = reduceFunction(preAcc)(curr);
            const preStack          = stack(stackPredecessor);
            return triple(preStack)(reduceFunction)(acc);
        }

        return If( hasPre(stack) )
                (Then( getTriple(argsTriple) ))
                (Else(           argsTriple  ));
    };

    const times = size(s);
    const reversedStack = times
                            (reduceIteration)
                                (triple
                                    (s)
                                    (acc => curr => push(acc)(curr))
                                    (emptyStack)
                                )
                                (thirdOfTriple);

    return times
            (reduceIteration)
                (triple
                    (reversedStack)
                    (reduceFn)
                    (initialValue)
            )(thirdOfTriple);
};

/**
 * A function that takes a stack and an index (as Church- or JS-Number).
 * The function returns the element at the passed index or undefined incl. a Error-Log to the Console
 *
 * @haskell getElementByIndex :: stack -> number -> a
 * @sideeffect Logs a error when index is no Church- or JS-Number or valid number
 * @function
 * @param {stack} stack
 * @return {function(index:churchNumber|jsNumber) : * } stack-value or undefined when not exist or invalid
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * getElementByIndex( stackWithNumbers )( n0 ) === id
 * getElementByIndex( stackWithNumbers )( n1 ) ===  0
 * getElementByIndex( stackWithNumbers )( n2 ) ===  1
 * getElementByIndex( stackWithNumbers )( n3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( 0 ) === id
 * getElementByIndex( stackWithNumbers )( 1 ) ===  0
 * getElementByIndex( stackWithNumbers )( 2 ) ===  1
 * getElementByIndex( stackWithNumbers )( 3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( "im a string" ) === undefined // strings not allowed, throws a Console-Warning
 */
const getElementByIndex = stack => index =>
    eitherElementByIndex(stack)(index)
     (console.error)
     (id);

/**
 * A function that takes a stack and an index (as Church- or JS-Number).
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByIndex :: stack -> number -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber|jsNumber) : either } a either with Right(value) or Lef("Element Error msg")
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * eitherElementByIndex( stackWithNumbers )( n0 )(id)(id) ===  id
 * eitherElementByIndex( stackWithNumbers )( n1 )(id)(id) ===   0
 * eitherElementByIndex( stackWithNumbers )( n2 )(id)(id) ===   1
 * eitherElementByIndex( stackWithNumbers )( n3 )(id)(id) ===   2
 *
 * eitherElementByIndex( stackWithNumbers )(  0 )(id)(id) ===  id
 * eitherElementByIndex( stackWithNumbers )(  1 )(id)(id) ===   0
 * eitherElementByIndex( stackWithNumbers )(  2 )(id)(id) ===   1
 * eitherElementByIndex( stackWithNumbers )(  3 )(id)(id) ===   2
 *
 * eitherElementByIndex( stackWithNumbers )( "im a string" )(id)(id) === "getElementByIndex - TypError: index value 'im a string' (string) is not allowed. Use Js- or Church-Numbers"
 */
const eitherElementByIndex = stack => index =>
    eitherTryCatch(
        () => eitherFunction(stack) // stack value is NOT a stack aka function
            (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherNaturalNumber(index)
                (_ => eitherElementByChurchIndex(stack)(index) )
                (_ => eitherElementByJsNumIndex (stack)(index) )
            ))
    (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack`)) // catch
    (id) // return value

/**
 * A function that takes a stack and an index as ChurchNumber.
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByChurchIndex :: stack -> churchNumber -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber) : either } a either with Right(value) or Lef("Element Error msg")
 */
const eitherElementByChurchIndex = stack => index =>
    eitherFunction(index)
        (_ => Left(`getElementByIndex - TypError: index value '${index}' (${typeof index}) is not allowed. Use Js- or Church-Numbers`))
        (_ => eitherNotNullAndUndefined( getElementByChurchNumberIndex(stack)(index) )
            (_ => Left("invalid index"))
            (e => Right(e))               );

/**
 * A function that takes a stack and an index as JsNumber.
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByJsNumIndex :: stack -> jsNumber -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:jsNumber) : either } a either with Right(value) or Lef("Element Error msg")
 */
const eitherElementByJsNumIndex = stack => index =>
    eitherNotNullAndUndefined( getElementByJsNumIndex(stack)(index) )
        (_ => Left("invalid index"))
        (e => Right(e)                );

/**
 * A function that takes a stack and an index as ChurchNumber.
 * The function returns the element at the passed index or if not exist a undefined
 *
 * @function
 * @param  {stack} s
 * @return {function(i:churchNumber) : *} stack-value
 */
const getElementByChurchNumberIndex = s => i =>
    If( leq(i)(size(s)))
        (Then( head( ( churchSubtraction(size(s))(i) )(getPreStack)(s))))
        (Else(undefined));

/**
 * A function that takes a stack and an index as JsNumber.
 * The function returns the element at the passed index or if not exist a undefined
 *
 * @function
 * @param  {stack} s
 * @return {function(i:Number) : *} stack-value
 */
const getElementByJsNumIndex = s => i => {
    if (i < 0){ return undefined; } // negativ index are not allowed

    const times = succ(size(s));
    const initArgsPair = pair(s)(undefined);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const result = pair(getPreStack(stack));

        return (jsNum(getStackIndex(stack)) === i)
            ? result(head(stack))
            : result(argsPair(snd));

    };
    return (times
                (getElement)(initArgsPair)
            )
            (snd);
};

/**
 * A function that takes a stack and an element. The function returns the index (ChurchNumber) of the element from the passed stack.
 * Returns undefined when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*) : churchNumber|undefined} a ChurchNumber or undefined
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * getIndexOfElement( stackWithNumbers )(  0 ) === n1
 * getIndexOfElement( stackWithNumbers )(  1 ) === n2
 * getIndexOfElement( stackWithNumbers )(  2 ) === n3
 * getIndexOfElement( stackWithNumbers )( 42 ) === undefined
 */
const getIndexOfElement = s => element => {

    const getIndex = argsPair => {
        const stack  = argsPair(fst);
        const result = pair(getPreStack(stack));

        return If( churchBool(head(stack) === element))
                    (Then( result(getStackIndex(stack)) ) )
                    (Else( result(argsPair(snd))        ) );
    }

    const times        = succ(size(s));
    const initArgsPair = pair(s)(undefined);

    return (times
             (getIndex)(initArgsPair)
           )
           (snd);
}

/**
 * A function that takes a stack and an element. The function returns a maybe-Monade Just with the index (ChurchNumber) of the element from the passed stack.
 * Returns Nothing when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*): either} Just(withIndex) or Nothing
 */
const maybeIndexOfElement = s => element => {
    const result = getIndexOfElement(s)(element)
    return result === undefined
            ? Nothing
            : Just(result);
}

/**
 * A function that takes a stack and an element.
 * Returns True (ChurchBoolean) when element does exist in the stack.
 * Returns False (ChurchBoolean) when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*) : churchBoolean } True or False
 */
const containsElement = s => element =>
    maybeIndexOfElement(s)(element)
        ( () => False )
        ( () => True  );

/**
 *  A function that takes an stack and converts the stack into an array. The function returns an array
 *
 * @param  {stack} s
 * @return {Array} Array
 * @example
 * const stackWithValues = convertArrayToStack( [1,2,3] )
 *
 * convertArrayToStack( stackWithValues ) === [1,2,3]
 */
const convertStackToArray = reduce(acc => curr => [...acc, curr])([]);

/**
 * A function that takes an javascript array and converts the array into a stack. The function returns a stack.
 *
 * @param  {Array} array
 * @return {stack} stack
 * const stackWithValues = convertArrayToStack( [1,2,3] )
 *
 * convertArrayToStack( stackWithValues ) === [1,2,3]
 */
const convertArrayToStack = array =>
    array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 * A function that takes an some Element and converts into a stack. The function returns a stack
 *
 * @param  {...*} elements
 * @return {stack} stack
 * const stackWithValues = convertElementsToStack( 1,2,3 )
 * convertStackToArray( stackWithValues ) === [1,2,3]
 *
 * const stackWithValues2 = convertElementsToStack( 1,2,3,...['a','b','c'] )
 * convertStackToArray( stackWithValues2 ) === [1,2,3,'a','b','c']
 */
const convertElementsToStack = (...elements) =>
    convertArrayToStack(elements);

/**
 * A function that accepts a stack and returns as a reversed stack.
 *
 * @param  {stack} s
 * @return {stack} stack (reversed)
 */
const reverseStack = s =>
    reduce(acc => _ => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))(s)(snd);

/**
 *  A function that accepts a map function and a stack. The function returns the mapped stack.
 *
 * @param  {function} mapFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const mapWithReduce = mapFunc =>
    reduce(acc => curr => push(acc)(mapFunc(curr)))(emptyStack);

/**
 *  A function that accepts a stack and a filter function. The function returns the filtered stack.
 *
 * @param  {function} filterFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const filterWithReduce = filterFunc =>
    reduce(acc => curr => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack);

/**
 *  A function that takes a map function and a stack. The function returns the mapped stack
 *
 * @param  {function} mapFunction
 * @return {function(s:stack): stack} stack
 * @example
 * const stackWithNumbers = convertArrayToStack([2,5,6])
 *
 * const stackMultiplied  = map( x => x * 2)(stackWithNumbers)
 *
 * getElementByIndex( stackMultiplied )( 1 ) ===  4
 * getElementByIndex( stackMultiplied )( 2 ) === 10
 * getElementByIndex( stackMultiplied )( 3 ) === 12
 */
const map = mapFunction => s => {

    const mapIteration = argsPair => {
        const _stack       = argsPair(snd);
        const _mappedValue = mapFunction(head(_stack));
        const _resultStack = push(argsPair(fst))(_mappedValue);
        return pair(_resultStack)(getPreStack(_stack));
    };

    const times        = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
             (mapIteration)(initArgsPair)
            )
            (fst);
};

/**
 * A function that accepts a stack and a filter function. The function returns the filtered stack
 *
 * @param  {function} filterFunction
 * @return {function(s:stack): stack} pair
 * @example
 * const stackWithNumbers = convertArrayToStack([42,7,3])
 *
 * filter(x => x < 20 && x > 5)(stackWithNumbers) === convertArrayToStack([7])
 */
const filter = filterFunction => s => {

    const filterIteration = argsPair => {
        const _stackFilter    = argsPair(fst);
        const _stack          = argsPair(snd);
        const _nextValueStack = getPreStack(_stack)
        const _stackCurrValue = head(_stack);

        if (filterFunction(_stackCurrValue)) {
            const resultStack = push(_stackFilter)(_stackCurrValue);
            return pair(resultStack)(_nextValueStack);
        }

        return pair(_stackFilter)(_nextValueStack);
    };

    const times = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
                (filterIteration)(initArgsPair)
            )
            (fst);
};

/**
 * A function that accepts a stack. The function performs a side effect. The side effect logs the stack to the console.
 *
 * @function
 * @sideffect log to Console
 * @param {stack} stack
 */
const logStackToConsole = stack =>
    forEach(stack)((element, index) => console.log("At Index " + index + " is the Element " + JSON.stringify(element)));

/**
 * stackOperationBuilder is the connector for Stack-Operations to have a Builderpattern
 *
 * @function stackOperationBuilder
 * @param   {stackOp} stackOp
 * @returns {function(s:stack): function(x:*): function(f:function): function(Function) } pushToStack
 */
const stackOpBuilder = stackOp => s => x => f =>
    f(stackOp(s)(x));

/**
 * pushToStack is a Stack-Builder-Command to push new values to the current stack
 *
 * @function
 * @param   {stackOpBuilder} stackOp
 * @returns {function(pushToStack)} pushToStack
 * @example
 * const stackOfWords = convertArrayToStack(["Hello", "World"])
 *
 * getElementByIndex( stackOfWords )( 1 ) === "Hello"
 * getElementByIndex( stackOfWords )( 2 ) === "World"
 */
const pushToStack = stackOpBuilder(push);

/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 */
const forEachOld = stack => f => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if (jsBool(hasPre(s))) {
            const element = head(s);
            const index = jsNum(succ(churchSubtraction(times)(size(s))));

            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times
        (iteration)(reversedStack);
};

/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 *
 * @function
 * @param stack
 * @return {function(callbackFunc:function): void}
 * @example
 * const stackWithNumbers = convertArrayToStack([5,10,15])
 *
 * forEach( stackWithNumbers )( (element, index) => console.log("At Index " + index + " is the Element " + element) );
 *
 * // Console-Output is:
 * // At Index 1 is the Element 5
 * // At Index 2 is the Element 10
 * // At Index 3 is the Element 15
 */
const forEach = stack => callbackFunc => {

    const invokeCallback = p => {
        const _stack   = p(fst);
        const _index   = p(snd);
        const _element = head(_stack);

        callbackFunc(_element, _index);

        return pair( getPreStack(_stack) )(_index + 1 );
    }

    const iteration = p =>
        If( hasPre(p(fst)) )
            (Then( invokeCallback(p) ))
            (Else(                p  ));

    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    times
        (iteration)( pair(reversedStack)(1) );
};

/**
 * The removeByIndex function takes a stack and a Church- or JS-Number as an index.
 * The function deletes the element at the passed index and returns the new stack.
 * If the index does not exist, the same stack is returned.
 *
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber|jsNumber) : stack } stack
 * @example
 * const stackWithStrings = convertArrayToStack(["Hello", "Haskell", "World"]);
 *
 * removeByIndex(stackWithStrings)(  2 )     // [ "Hello", "World" ]
 * removeByIndex(stackWithStrings)( n2 )     // [ "Hello", "World" ]
 */
const removeByIndex = stack => index => {

    const removeByCondition = currentStack => resultStack => index => currentIndex => {
        const currentElement    = head(currentStack);
        const result            = If( eq(index)(currentIndex) )
                                    (Then( resultStack ))
                                    (Else( push( resultStack )( currentElement )));

        return triple
                ( getPreStack(currentStack) )
                ( result                    )
                ( succ(currentIndex)        );
    }

    const removeElementFn = stack => index => {
        const times         = size(stack);
        const reversedStack = reverseStack(stack);

        const iteration = argsTriple => {
            const currentStack = argsTriple(firstOfTriple);
            const resultStack  = argsTriple(secondOfTriple);
            const currentIndex = argsTriple(thirdOfTriple);

            return If(hasPre(currentStack))
                      (Then( removeByCondition(currentStack)(resultStack)(index)(currentIndex) ))
                      (Else( argsTriple                                                        ));
        }

        return times
                (iteration)
                    (triple
                        ( reversedStack )
                        ( emptyStack    )
                        ( n1            )
                    )
                (secondOfTriple);
    };

    return eitherTryCatch(
        () => eitherFunction(stack) // stack value is NOT a stack aka function
            (_ => Left(`removeByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherNaturalNumber(index)
                (_ => removeElementFn(stack)(index))
                (_ => removeElementFn(stack)(churchNum(index)))
            ))
    (_ => Left(`removeByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack`)) // catch
    (id) // return value
}

/**
 * Takes two stacks and concat it to one. E.g.:  concat( [1,2,3] )( [1,2,3] ) -> [1,2,3,1,2,3]
 *
 * @function
 * @haskell concat :: [a] -> [a] -> [a]
 * @param  {stack} s1
 * @return {function(s2:stack)} a concat stack
 * @example
 * const elements1          = convertArrayToStack( ["Hello", "Haskell"] );
 * const elements2          = convertArrayToStack( ["World", "Random"] );
 * const concatenatedStacks = concat( elements1 )( elements2 );
 *
 * jsNum( size( concatenatedStacks ) )          === 4
 * getElementByIndex( concatenatedStacks )( 0 ) === id
 * getElementByIndex( concatenatedStacks )( 1 ) === "Hello"
 * getElementByIndex( concatenatedStacks )( 2 ) === "Haskell"
 * getElementByIndex( concatenatedStacks )( 3 ) === "World"
 * getElementByIndex( concatenatedStacks )( 4 ) === "Random"
 */
const concat = s1 => s2 =>
    s1 === emptyStack
        ? s2
        : s2 === emptyStack
          ? s1
          : reduce(acc => curr => push(acc) (curr)) (s1) (s2);

/**
 * This function flatten a nested stack of stacks with values.
 * The function links them all together to form a stack. The depth level to which the structure is flattened is one.
 *
 * @function
 * @param  {stack} stack
 * @return {stack} a flatten stack
 * @example
 * const s1            = convertArrayToStack([1, 2]);
 * const s2            = convertArrayToStack([3, 4]);
 * const s3            = convertArrayToStack([5, 6]);
 * const stackOfStacks = convertArrayToStack([s1, s2, s3]);
 *
 * const flattenStack  = flatten( stackOfStacks );
 *
 * jsNum( size( flattenStack ) )          ===  6
 *
 * convertStackToArray(flattenStack)      === [1,2,3,4,5,6]
 *
 * getElementByIndex( flattenStack )( 0 ) === id
 * getElementByIndex( flattenStack )( 1 ) ===  1
 * getElementByIndex( flattenStack )( 2 ) ===  2
 * getElementByIndex( flattenStack )( 3 ) ===  3
 * getElementByIndex( flattenStack )( 4 ) ===  4
 * getElementByIndex( flattenStack )( 5 ) ===  5
 * getElementByIndex( flattenStack )( 6 ) ===  6
 */
const flatten = reduce( acc => curr => concat( acc )( curr ) )(emptyStack);

/**
 * The zipWith function receives a linking function and two stacks.
 * Using the linking function, the elements of the two transferred stacks are linked together to form a new stack.
 * If one of the two stacks passed is shorter, only the last element of the shorter stack is linked.
 *
 * @function
 * @haskell zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 * @param  {function} f
 * @return {function(s1:stack): function(s2:stack): stack}
 * @example
 * const add = x => y => x + y;
 * const s1  = convertArrayToStack([1, 2, 3]);
 * const s2  = convertArrayToStack([4, 5, 6]);
 *
 * const zippedStack = zipWith(add)(s1)(s2);
 *
 * convertStackToArray( zippedStack )    === [5,7,9]
 *
 * jsNum( size( zippedStack ) )          ===  3
 *
 * getElementByIndex( zippedStack )( 0 ) === id
 * getElementByIndex( zippedStack )( 1 ) ===  5
 * getElementByIndex( zippedStack )( 2 ) ===  7
 * getElementByIndex( zippedStack )( 3 ) ===  9
 */
const zipWith = f => s1 => s2 => {

    const zipElements = t => {
        const s1  = t(firstOfTriple);
        const s2  = t(secondOfTriple);
        const acc = t(thirdOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = push(acc)( f(element1)(element2) );

        return triple
            ( getPreStack(s1) )
            ( getPreStack(s2) )
            ( result          );
    }

    const iteration = t =>
        If( hasPre(t(firstOfTriple)) )
            (Then( zipElements(t) ))
            (Else(             t  ));

    const times = min(size(s1))(size(s2));

    return times
        (iteration)
        (triple
            ( reverseStack(s1) )
            ( reverseStack(s2) )
            ( emptyStack       )
        )
        (thirdOfTriple);
}

/**
 * Zip (combine) two Stack to one stack of pairs
 * If one of the two stacks passed is shorter, only the last element of the shorter stack is linked.
 *
 * @function
 * @haskell zip :: [a] -> [b] -> [(a, b)]
 * @type {function(triple): function(triple): triple}
 * @example
 * const s1 = convertArrayToStack([1, 2]);
 * const s2 = convertArrayToStack([3, 4]);
 *
 * const zippedStack = zip(s1)(s2);
 *
 * jsNum( size(zippedStack) )          === 2
 * getElementByIndex( zippedStack )(0) === id
 * getElementByIndex( zippedStack )(1) === pair(1)(3)
 * getElementByIndex( zippedStack )(2) === pair(2)(4)
 */
const zip = zipWith(pair);

/**
 * Check two stacks of equality.
 *
 * @function
 * @param {stack} s1
 * @return {function(s2:stack): churchBoolean} True / False (ChurchBoolean)
 * @example
 * const s1 = convertArrayToStack([1, 2, 7]);
 * const s2 = convertArrayToStack([1, 2, 3]);
 *
 * stackEquals(s1)(s1) === True
 * stackEquals(s1)(s2) === False
 */
const stackEquals = s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const times = size1;

    const compareElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = churchBool(element1 === element2);

        return triple
                ( getPreStack(s1) )
                ( getPreStack(s2) )
                ( result          );
    }

    const iteration = t =>
        LazyIf( and( hasPre( t(firstOfTriple)) )( t(thirdOfTriple)) )
         (Then(() => compareElements(t) ))
         (Else(() => t                  ));

    return LazyIf( eq(size1)(size2) )
                (Then(() => times
                                (iteration)
                                    (triple
                                        ( reverseStack(s1) )
                                        ( reverseStack(s2) )
                                        ( True             )
                                    )
                                    (thirdOfTriple))
                )
                (Else(() => False));
};
