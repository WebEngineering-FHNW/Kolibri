/**
 * @module stdtypes
 * The js doc definitions of the types that are most commonly used.
 */

/**
 * @template  _T_
 * @typedef { <_T_> (...x) => _T_ } ProducerType
 * A function that takes arbitrary arguments (possibly none) and produces a value of type _T_.
 */

/**
 * @template  _T_
 * @typedef { <_T_> (_T_) => void } ConsumerType
 * A function that consumes a value of type _T_ and returns nothing.
 */

/**
 * @template  _T_
 * @typedef { <_T_> (_T_) => Boolean } ConsumingPredicateType
 * A function that consumes a value of type _T_ and returns a Boolean.
 */

/**
 * @template  _T_
 * @typedef { <_T_>  (_T_) => _T_ } UnaryOperatorType
 * A unary operator on _T_.
 */

/**
 * A function which takes one argument of type {@link _A_} and transforms it to {@link _B_}.
 * @template _A_, _B_
 * @typedef { <_A_,_B_>  (_A_) => _B_ } FunctionType
 */

/**
 * A callback which takes two arguments of type {@link _A_} and transforms it to {@link _A_}.
 * @template _A_
 * @callback BiOperation
 * @param   { _A_ } value1
 * @param   { _A_ } value2
 * @returns { _A_ }
 */

/**
 * @template  _T_, _U_, _R_
 * A callback which takes two arguments of type _T_ and _U_}and transforms it to _R_.
 * @callback BiFunction
 * @type {  <_T_, _U_, _R_> (value1:_T_, value2:_U_) => _R_ }
 */

/**
 * A callback which takes an argument of type {@link _A_} and
 * a second argument of type {@link _A_} and returns a boolean.
 * @template _A_
 * @template _B_
 * @callback BiPredicate
 * @param   { _A_ } value1
 * @param   { _B_ } value2
 * @returns { boolean }
 */

/**
 * Defines a Monad.
 * @template  _T_
 * @typedef  MonadType
 * @property { <_U_> (bindFn: (_T_) => MonadType<_U_>) => MonadType<_U_> } and
 * @property { <_U_> (f:      (_T_) => _U_)            => MonadType<_U_> } fmap
 * @property {       (_T_)                             => MonadType<_T_> } pure
 * @property {       ()                                => MonadType<_T_> } empty
 */
