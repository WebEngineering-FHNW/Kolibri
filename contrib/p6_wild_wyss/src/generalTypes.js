/**
 * A callback which takes one argument of type {@link _A_} and transforms it to {@link _B_}.
 * @template _A_
 * @template _B_
 * @callback Functor
 * @param   { _A_ } value
 * @returns { _B_ }
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
 * A callback which takes two arguments of type {@link _T_} and {@link _U_} and transforms it to {@link _R_}.
 * @template _T_
 * @template _U_
 * @template _R_
 * @callback BiFunction
 * @param   { _T_ } value1
 * @param   { _U_ } value2
 * @returns { _R_ }
 */
/**
 * A callback which takes one argument of type {@link _A_} and transforms it to {@link _A_}.
 * @template _A_
 * @callback UnaryOperation
 * @param   { _A_ } value
 * @returns { _A_ }
 */

/**
 * A callback which takes no arguments and returns an {@link _A_}
 * @template _A_
 * @callback Producer
 * @returns { _A_ }
 */

/**
 * A callback which takes one argument and does something. (Usually this leads in a side effect)
 * @template _A_
 * @callback Consumer
 * @impure
 * @param { _A_ } value
 * @returns void
 */

/**
 * A callback which takes one argument of type {@link _A_} and returns a boolean.
 * @template _A_
 * @callback Predicate
 * @param   { _A_ } value
 * @returns { boolean }
 */

/**
 * A callback which takes two argument of type {@link _A_} and returns a boolean.
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
