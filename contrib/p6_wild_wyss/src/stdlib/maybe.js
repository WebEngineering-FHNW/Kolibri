import { Left, Right } from "../../../../docs/src/kolibri/lambda/church.js";

export { Nothing, Just, MaybePrototype }

/**
 * @typedef MaybeMonadType
 * @template _T_,_U_
 * @property { <_V_> ((_T_) => MaybeType<_V_>) => MaybeType<_V_,_U_> } and -
 * @property { <_V_> ((_T_) => _V_)            => MaybeType<_V_,_U_> } fmap
 * @property { <_V_> (_V_)                     => MaybeType<_V_,_U_> } pure
 * @property {       ()                        => MaybeType<_T_,_U_> } empty
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
 * @template _T_, _U_
 * @typedef { ((f:FunctionAtoBType<_T_, _U_>)  => (g:*) => _U_) & MaybeMonadType<_T_, _U_> } NothingXType
 */
/**
 * Nothing is the error case of the Maybe type. A "Maybe a" can be either Nothing or "{@link Just} a".
 * Nothing is immutable. Nothing is a singleton.
 * Nothing is used to get around missing null/undefined checks.
 * @haskell Nothing :: Maybe a
 * @pure
 * @template _T_, _U_
 * @type    { NothingXType<_T_,_U_>}
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
 * @template _T_, _U_
 * @typedef { ((f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_) & MaybeMonadType<_T_, _U_> } JustXType
 */

/**
 * Just is the success case of the Maybe type. A "Maybe a" can be either {@link Nothing} or "Just a".
 * Just values are immutable.
 * Just is used to get around missing null/undefined checks.
 * @haskell Just a :: Maybe a
 * @pure
 * @type    { <_T_, _U_>  (x:_T_) =>  JustXType<_T_, _U_>}
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
