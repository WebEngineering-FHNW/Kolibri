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
 * @callback BinaryOperation
 * @param   { _A_ } value1
 * @param   { _A_ } value2
 * @returns { _A_ }
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
 * A callback which takes one argument and returns an {@link _A_}
 * @template _A_
 * @callback Predicate
 * @param   { _A_ } value
 * @returns { boolean }
 */