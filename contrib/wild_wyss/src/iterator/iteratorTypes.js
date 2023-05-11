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
 * @property { <_U_>(bindFn: (_T_) => IteratorType<_U_>) => IteratorType<_U_> } and
 */

/**
 * @template _T_
 * @typedef IteratorBuilderType
 * @property { InsertIntoBuilder<_T_> } prepend - adds one or more elements to the beginning of the {@link IteratorBuilderType}
 * @property { InsertIntoBuilder<_T_> } append  - adds one or more elements to the end of the {@link IteratorBuilderType}
 * @property { () => IteratorType<_T_> } build  - starts the built phase and returns an {@link IteratorType} which iterates over the added elements
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

/**
 * Adds multiple elements to this {@link IteratorBuilderType}.
 * @template _T_
 * @callback InsertIntoBuilder
 * @param   { ...(_T_ | IteratorType<_T_>) } args
 * @returns IteratorBuilderType<_T_>
 */


/**
 * Defines a Monad.
 * @typedef   MonadType
 * @template  _T_
 * @property  { <_U_>
 *                 (bindFn: (_T_) => MonadType<_U_>)
 *              => MonadType<_U_>
 *            } and
 */
