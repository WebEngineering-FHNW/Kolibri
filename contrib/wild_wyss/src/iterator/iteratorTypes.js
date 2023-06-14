// typedefs

/**
 * This type combines the {@link Iterable} with {@link MonadType}.
 * Objects of this type can therefore be used in [for..of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loops,
 * and further syntactical sugar.
 *
 * Additionally, such objects are monadic and provide therefore all functions that make up a monad.
 *
 * _Note_: The Kolibri defines many functions of type {@link IteratorOperation} which can be used to
 * transform the elements of this Sequence.
 *
 * @template _T_
 * @typedef {
 *            {
 *              and:  <_U_>(bindFn: (_T_) => IteratorMonadType<_U_>) => IteratorMonadType<_U_>,
 *              pure: <_U_>(_U_)             => IteratorMonadType<_U_>,
 *              fmap: <_U_>(f: (_T_) => _U_) => IteratorMonadType<_U_>,
 *              empty: ()                    => IteratorMonadType<_T_>
 *            } & Iterable<_T_>
 * } IteratorMonadType
 */
/**
 * @template _T_
 * @typedef IteratorBuilderType
 * @property { InsertIntoBuilder<_T_> } prepend - adds one or more elements to the beginning of the {@link IteratorBuilderType}
 * @property { InsertIntoBuilder<_T_> } append  - adds one or more elements to the end of the {@link IteratorBuilderType}
 * @property { () => IteratorMonadType<_T_> } build  - starts the built phase and returns an {@link IteratorMonadType} which iterates over the added elements
 */

// callbacks
/**
 * Defines a single operation to decorate an existing {@link IteratorMonadType}.
 *
 * @callback IteratorOperation
 * @template _T_
 * @template _U_
 * @param   { Iterable<_T_>} iterator
 * @returns { IteratorMonadType<_U_>}
 */

/**
 * Pipe applies the given {@link IteratorOperation} to the iterator it is called on.
 * @callback Pipe
 * @param { ...IteratorOperation<any,any>} it
 * @returns { IteratorMonadType<any> }
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
 * @param   { ...(_T_ | Iterable<_T_>) } args
 * @returns IteratorBuilderType<_T_>
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
