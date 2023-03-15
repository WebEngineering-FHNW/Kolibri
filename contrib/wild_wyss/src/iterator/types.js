// typedefs
/**
 * This type is conform to the JS iteration protocols and can therefore
 * be used in for ... of loops and other syntactical sugar.
 *
 * Furthermore, the Kolibri defines many of functions of type
 * {@link IteratorOperation} which can be used to
 * transform the elements of this Iterator.
 *
 * @typedef IteratorType
 * @template _T_
 * @property { () => { next: () => IteratorResult<_T_, _T_> } } [Symbol.iterator] - returns the iterator for this object.
 * @property { () => IteratorType<_T_> }                        copy - creates a copy of this {@link IteratorType}
 */

// callbacks
/**
 * Defines a single operation to decorate an existing {@link IteratorType}.
 *
 * _Note_: Functions of this type must always copy the given iterator.
 * @callback IteratorOperation
 * @template _T_
 * @template _U_
 * @param { IteratorType<_T_> } iterator
 * @returns { IteratorType<_U_>}
 */

/**
 * Pipe applies the given {@link IteratorOperation} to the iterator it is called on.
 * @callback Pipe
 * @param { ...IteratorOperation<any,any>} it
 * @returns { IteratorType<any> }
 */

/**
 * @template _T_
 * @callback ArrayApplierType
 * @param Array<_T_>
 * @returns any
 */
