import { Left, Right } from "./church.js";

export { Nothing, Just, MaybePrototype }
export { catMaybes, choiceMaybe }


/**
 * @typedef MaybeMonadType
 * @template _T_
 * @property { <_V_> ((_T_) => MaybeType<_V_>) => MaybeType<_V_> } and
 * @property { <_V_> ((_T_) => _V_)            => MaybeType<_V_> } fmap
 * @property { <_V_> (_V_)                     => MaybeType<_T_> } pure
 * @property {       ()                        => MaybeType<_T_> } empty
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
 * @typedef { ProducerType<*>  } NothingBaseType
 */

/**
 * @typedef { NothingBaseType & MaybeMonadType<*> } NothingType
 */

/**
 * Nothing is the error case of the Maybe type. A "Maybe a" can be either Nothing or "{@link Just} a".
 * Nothing is immutable. Nothing is a singleton.
 * Nothing is used to get around missing null/undefined checks.
 * @haskell Nothing :: Maybe a
 * @pure
 * @type    { NothingType }
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
 * @typedef { NothingType | JustType<_T_> } MaybeType
 * @template _T_
 * @pure
 */



/**
 * Type of the {@link Just} constructor after being bound to a value x of type _T_.
 * @template _T_
 * @typedef { <_U_> (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ } JustBaseType
 */
/** @typedef { JustBaseType<_T_> & MaybeMonadType<T> } JustType
 * @template _T_
 */

/**
 * Just is the success case of the Maybe type. A "Maybe a" can be either {@link Nothing} or "Just a".
 * Just values are immutable.
 * Just is used to get around missing null/undefined checks.
 * @haskell Just a :: Maybe a
 * @pure
 * @type    { <_T_>  (x:_T_) =>  JustType<_T_>}
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
 * The catMaybes function takes a list of Maybes and returns a list of all the Just values.
 *
 * @template _T_
 * @haskell [Maybe a] -> [a]
 * @param  { Iterable<MaybeType<_T_>> } maybes
 * @returns { Array<_T_> }
 */
const catMaybes = maybes => {
  const result = [];
  for (const maybe of maybes) {
    maybe(_ => _)(val => result.push(val));
  }
  return result;
};


/**
 * Chooses between the two given Maybe values.
 * If the first is a {@link JustType} it will be returned,
 * otherwise the second value will be returned.
 *
 * @type {<_T_>
 *      (maybe1: MaybeType<_T_>)
 *   => (maybe2: MaybeType<_T_>)
 *   => MaybeType<_T_>
 * }
 *
 * @example
 * const just    = Just(1);
 * const nothing = Nothing;
 *
 * const choice1 = choiceMaybe(just)(nothing)
 * const choice2 = choiceMaybe(nothing)(just)
 * console.log(choice1 === just && choice2 === just);
 * // => Logs 'true'
 */
const choiceMaybe = maybe1 => maybe2 =>
  maybe1
    (_ => maybe2)
    (_ => maybe1);
