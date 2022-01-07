import {id, pair} from "../lambda-calculus-library/lambda-calculus.js";
import {convertArrayToStack, emptyStack, push, reduce} from "../stack/stack.js";
import {emptyListMap} from "../listMap/listMap.js";
export {Nothing, Just, mapMaybe, flatMapMaybe, maybeNumber, maybeFunction, maybeDivision, eitherDomElement, getOrDefault, getDomElement, getDomElements, maybeTruthy, eitherNumber, Left, Right, eitherFunction, eitherElementOrCustomErrorMessage, eitherTryCatch, maybeDomElement, eitherElementsOrErrorsByFunction, maybeElementsByFunction, eitherNotNullAndUndefined, maybeNotNullAndUndefined, eitherNaturalNumber}

/*
    EITHER-Type
    Left and Right are two functions that accept one value and two functions respectively.
    Both functions ignore one of the two passed functions.
    The Left function applies the left (first passed) function to the parameter x and ignores the second function.
    The Right function applies the right (second passed) function to the parameter x and ignores the first function.
    Left and Right form the basis for another type, the Maybe Type.
 */
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = id;

/*
    MAYBE-Type
    The Maybe Type builds on the Either Type and comes from the world of functional programming languages.
    The Maybe Type is a polymorphic type that can also (like the Either Type) assume two states.
    The states are: there is a value, which is expressed with Just(value), or there is no value, which is expressed with Nothing.
 */
const Nothing  = Left();
const Just     = Right ;

/**
 * unpacks the Maybe element if it is there, otherwise it returns the default value
 *
 * @param maybe
 * @return {function(defaultVal:function): *} maybe value or given default value
 * @example
 * getOrDefault( maybeDiv(6)(2) )( "Can't divide by zero" ) === 3
 * getOrDefault( maybeDiv(6)(0) )( "Can't divide by zero" ) === "Can't divide by zero"
 */
const getOrDefault = maybe => defaultVal =>
    maybe
        (() => defaultVal)
        (id);

/**
 * The function maybeDivision "maybe" performs a division with 2 passed parameters.
 * If the passed numbers are of type integer and the divisor is not 0, the division is performed and Just is returned with the result.
 *
 * @param  {number} dividend
 * @return {function(divisor:number): function(Just|Nothing)} a Maybe (Just with the divided value or Nothing)
 */
const maybeDivision = dividend => divisor =>
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(dividend / divisor)
        : Nothing;

/**
 * The eitherTruthy function expects a value and checks whether it is truthy.
 * In case of success, a Right with the element is returned and in case of error a Left with the corresponding error message.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with the truthy value or Left with Error
 */
const eitherTruthy = value =>
    value
      ? Right(value)
      : Left(`'${value}' is a falsy value`);

/**
 * Take the element as maybe value if the element is a truthy value inclusive number Zero.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeTruthy = value =>
    eitherTruthy(value)
        (_ => Nothing)
        (_ => Just(value));

/**
 * The eitherNotNullAndUndefined function expects a value and checks whether it is not null or undefined.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with the truthy value or Left with Error
 */
const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);

/**
 * The maybeNotNullAndUndefined function expects a value and checks whether it is not null or undefined.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeNotNullAndUndefined = value =>
    eitherNotNullAndUndefined(value)
        (_ => Nothing)
        (_ => Just(value));

/**
 * The eitherElementOrCustomErrorMessage function expects an error message and an element.
 * The function checks the element for null or undefined and returns either a Right with the value or a Left with the error message passed.
 *
 * @param  {string} errorMessage
 * @return {function(element:*): Left|Right} either Right with the given Element or Left with the custom ErrorMessage
 */
const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherNotNullAndUndefined(element)
        (_ => Left(errorMessage))
        (_ => Right(element));

/**
 * The eitherDomElement function takes a Dom element id and returns an Either Type.
 * If successful, the HTML element is returned, otherwise an error message that such an element does not exist.
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage
        (`no element exist with id: ${elemId}`)
        (document.getElementById(elemId));

/**
 * This function takes a DOM element ID as a string.
 * If an element with this ID exists in the DOM, a Just with this HTMLElement is returned, otherwise Nothing.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeDomElement = elemId =>
    eitherDomElement(elemId)
        (_ => Nothing)
        (e => Just(e));

/**
 * This function takes a DOM element ID as a string.
 * If an element with this ID exists in the DOM, the HTMLElement is returned, otherwise undefined.
 *
 * @param  {string} elemId
 * @return {HTMLElement|undefined} HTMLElement when exist, else undefined
 */
const getDomElement = elemId =>
    eitherDomElement(elemId)
        (console.error)
        (id);

/**
 * This function takes many DOM element ID as array of string.
 * If elements with those ID exists in the DOM, the HTMLElements ares returned, otherwise undefined
 *
 * @param  {string} elemIds
 * @return {HTMLElement|undefined[]} a array with HTMLElements when exist, else undefined
 */
const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement);

/**
 * This function takes a value and checks whether it is of the type Integer.
 * If it is not a value of the type Integer, a Nothing is returned.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeNumber = value =>
    eitherNumber(value)
        (_ => Nothing)
        (_ => Just(value));

/**
 * The eitherNumber function checks whether a value is of the integer type.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with number or Left with Error
 */
const eitherNumber = value =>
    Number.isInteger(value)
        ? Right(value)
        : Left(`'${value}' is not a integer`);

/**
 * The eitherNaturalNumber function checks whether the value passed is a natural JavaScript number.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with positiv number or Left with Error
 */
const eitherNaturalNumber = value =>
    Number.isInteger(value) && value >= 0
        ? Right(value)
        : Left(`'${value}' is not a natural number`);

/**
 * The eitherFunction function checks whether a value is of the type function.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with function or Left with Error
 */
const eitherFunction = value =>
    typeof value === "function"
        ? Right(value)
        : Left(`'${value}' is not a function`);

/**
 * The maybeFunction function checks whether a value is of the type function.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeFunction = value =>
    eitherFunction(value)
        (_ => Nothing)
        (_ => Just(value))

/**
 * The eitherTryCatch function takes a function f that could go wrong.
 * This function is executed in a try-catch block.
 * If an error occurs during the execution of the function, it is caught and a left is returned with the error message, otherwise a right with the result.
 *
 * @param  {function} f
 * @return {Left|Right} either Right with function or Left with Error
 */
const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}

/**
 * The function eitherElementsOrErrorsByFunction takes a function as the first parameter and a rest parameter (JavaScript Rest Parameter) as the second parameter.
 * The function that is passed should take a value and return an Either Type. The function eitherElementsOrErrorsByFunction then applies the passed function to any value passed by the Rest parameter.
 * An Either is returned: In case of success (Right) the user gets a ListMap with all "success" values. In case of an error, the user gets a stack with all error messages that occurred.
 *
 * @haskell eitherElementsOrErrorsByFunction:: (a -> Either a) -> [a] -> Either [a]
 * @param  {function} eitherProducerFn
 * @return {function(elements:...[*]): {(Left|Right)}} either Right with all "success" values as ListMap or Left with all error messages that occurred as Stack
 */
const eitherElementsOrErrorsByFunction = eitherProducerFn => (...elements) =>
    reduce(acc => curr =>
        acc
         ( stack => Left( eitherProducerFn(curr)
                            (err => push(stack)(err) )
                            (_   => stack            )
                        )
         )
         ( listMap => eitherProducerFn(curr)
                        (err => Left(  push( emptyStack )( err             )))
                        (val => Right( push( listMap    )( pair(curr)(val) )))
         )
    )
    ( Right( emptyListMap) )
    ( convertArrayToStack(elements) );

// Haskell: (a -> Maybe a) -> [a] -> Maybe [a]
const maybeElementsByFunction = maybeProducerFn => (...elements) =>
    reduce
    (acc => curr =>
        flatMapMaybe(acc)(listMap =>
            mapMaybe( maybeProducerFn(curr) )(val => push(listMap)( pair(curr)(val) ))
        )
    )
    ( Just(emptyListMap) )
    ( convertArrayToStack(elements) );

/**
 * The mapMaybe function is used to map a Maybe Type. The function takes a Maybe and a mapping function f.
 * The function returns the mapped Maybe.
 *
 * @param  {function} maybe
 * @return {function(f:function): Just|Nothing} a Maybe (Just with the element or Nothing)
 * @example
 * mapMaybe( Just(10) ) (x => x * 4) // Just (40)
 * mapMaybe( Nothing )  (x => x * 4) // Nothing
 */
const mapMaybe  = maybe => f => maybe (() => maybe) (x => Just(f(x)));  // maybe.map

/**
 * The function flatMapMaybe is used to map a maybe type and then flatten the result.
 *
 * @param  {function} maybe
 * @return {function(f:function): Just|Nothing} a Maybe (Just with the element or Nothing=
 * @example
 * flatMapMaybe( Just(10) )(num => Just(num * 2));    // Just (20)
 * flatMapMaybe( Just(10) )(num => Nothing      );    // Nothing
 * flatMapMaybe( Nothing  )(num => Just(num * 2));    // Nothing
 */
const flatMapMaybe = maybe => f => maybe (() => maybe) (x =>       f(x));  // maybe.flatmap
