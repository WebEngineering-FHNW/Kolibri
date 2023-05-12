import {bind} from "../iterator/operators/bind/bind.js";
import {map} from "../iterator/operators/map/map.js";
import {PureIterator} from "../iterator/constructors/pureIterator/pureIterator.js";
import {Iterator, IteratorPrototype} from "../iterator/constructors/iterator/iterator.js";

export { Left, Right, Nothing, Just }
/*
 * The Either types.
 * @haskell Either a b
 */

/**
 * A generic function from whatever type "a" to whatever "b".
 * Only needed internally for the sake of proper JsDoc.
 * @typedef  FunctionAtoBType
 * @pure     supposed to be pure
 * @type     { <_T_, _U_> (x:_T_) => _U_ }
 */

/**
 * Type of the {@link Left} constructor after being bound to a value x of type _T_.
 * @typedef LeftXType
 * @type    { <_T_, _U_>  (f:FunctionAtoBType<_T_, _U_>) => (g:*) => _U_ }
 */

/**
 * The Left constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type "a" and waits for two more functions f and g
 * as curried arguments.
 * When both are given, f(x) is called.
 * The Left case of an Either type is usually (but not necessarily so) an error case.
 * Left values are immutable.
 * @haskell a -> (a -> b) -> c -> b
 * @pure    if FunctionAtoBType is pure
 * @type    { <_T_, _U_>  (x:_T_) =>  LeftXType<_T_, _U_> }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))      // handle left case
 *      (x   => doSomethingWithFoo(x));  // handle right case
 */

const Left = x => f => _g => f(x);


/**
 * Type of the {@link Right} constructor after being bound to a value x of type _T_.
 * @typedef RightXType
 * @type     { <_T_, _U_>  (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ }
 */

/**
 * The Right constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type "b" and waits for two more functions f and g
 * as curried arguments.
 * When both are given, g(x) is called.
 * The Right case of an Either type is usually (but not necessarily so) the good case.
 * Right values are immutable.
 * @haskell a -> c -> (a -> b) -> b
 * @pure    if FunctionAtoBType is pure
 * @type    { <_T_, _U_>  (x:_T_) =>  RightXType<_T_, _U_> }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))
 *      (x   => doSomethingWithFoo(x));
 */
const Right = x => _f => g => g(x);

/**
 * @typedef { LeftXType<_T_,_U_> | RightXType<_T_,_U_> } EitherType
 * @template _T_
 * @template _U_
 * @pure
 */

const MaybePrototype = () => undefined;
MaybePrototype.and = function (bindFn) {
  let returnVal;
  this
    (_ => returnVal = Nothing)
    (x => returnVal = bindFn(x));
  return returnVal;
};

MaybePrototype.fmap = function (mapper) {
  return this.and(x => Just(mapper(x)));
};

MaybePrototype.pure = val => Just(val);
MaybePrototype.empty = () => Nothing;
/**
 * Type of the {@link Nothing} constructor after _not_ being bound to anny value.
 * @typedef NothingXType
 * @type    { <_T_, _U_>  (f:FunctionAtoBType<_T_, _U_>)  => (g:*) => _U_ }
 */
/**
 * Nothing is the error case of the Maybe type. A "Maybe a" can be either Nothing or "{@link Just} a".
 * Nothing is immutable. Nothing is a singleton.
 * Nothing is used to get around missing null/undefined checks.
 * @haskell Nothing :: Maybe a
 * @pure
 * @type    { <_T_, _U_>  (f:FunctionAtoBType<_T_, _U_>)  => (g:*) => _U_ }
 *
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Nothing = Left (undefined);
Object.setPrototypeOf(Nothing, MaybePrototype);
/**
 * Type of the {@link Just} constructor after being bound to a value x of type _T_.
 * @typedef JustXType
 * @type    { <_T_, _U_>  (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ }
 */

/**
 * Just is the success case of the Maybe type. A "Maybe a" can be either {@link Nothing} or "Just a".
 * Just values are immutable.
 * Just is used to get around missing null/undefined checks.
 * @haskell Just a :: Maybe a
 * @pure
 * @type    { <_T_, _U_>  (x:_T_) =>  (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ }
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Just = val => {
 const r = Right(val);
 Object.setPrototypeOf(r, MaybePrototype);
 return r;
};


/**
 * @typedef { NothingXType<_T_, _U_> | JustXType<_T_, _U_> } MaybeType
 * @template _T_
 * @template _U_
 * @pure
 */
