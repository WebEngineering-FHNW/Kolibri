// typedefs

/**
 * This type combines the {@link Iterable} with {@link MonadType}.
 * Objects of this type can therefore be used in [for..of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loops,
 * and further syntactical sugar.
 *
 * Additionally, such objects are monadic and provide therefore all functions that make up a monad.
 *
 * _Note_: The Kolibri defines many functions of type {@link SequenceOperation} which can be used to
 * transform the elements of this Sequence.
 *
 * @template _T_
 * @typedef {
 *            {
 *              and:  <_U_>(bindFn: (_T_) => SequenceType<_U_>)   => SequenceType<_U_>,
 *              fmap: <_U_>(f: (_T_)      => _U_)                 => SequenceType<_U_>,
 *              pure: <_U_>(_U_)                                  => SequenceType<_U_>,
 *              empty:     ()                                     => SequenceType<_T_>,
 *              pipe:      function(...transformers: SequenceOperation<*,*>): SequenceType<*> | *,
 *              toString:  (maxValues?: Number)                   => String,
 *              "==":      (that: SequenceType<_T_>)              => Boolean
 *            } & Iterable<_T_>
 * } SequenceType
 */

/**
 * @template _T_
 * @typedef SequenceBuilderType
 * @property { InsertIntoBuilder<_T_> } prepend - adds one or more elements to the beginning of the {@link SequenceBuilderType}
 * @property { InsertIntoBuilder<_T_> } append  - adds one or more elements to the end of the {@link SequenceBuilderType}
 * @property { () => SequenceType<_T_> } build  - starts the built phase and returns an {@link SequenceType} which iterates over the added elements
 */

// callbacks
/**
 * Defines a single operation to decorate an existing {@link SequenceType}.
 *
 * @callback SequenceOperation
 * @template _T_
 * @template _U_
 * @param   { Iterable<_T_>} iterable
 * @returns { SequenceType<_U_>}
 */

/**
 * @callback PipeTransformer
 * @template _T_, _U_
 * @type { SequenceOperation<_T_, _U_> | ((SequenceType) => *)}
 */
/**
 * Pipe applies the given {@link SequenceOperation} to the {@link Iterable} it is called on.
 * @callback Pipe
 * @param { ...SequenceOperation<any,any>} operations
 * @returns { SequenceType<any> }
 */

/**
 * @template _T_
 * @callback ArrayApplierType
 * @param { Array<_T_> } arr
 * @returns any
 */

/**
 * Adds multiple elements to this {@link SequenceBuilderType}.
 * @template _T_
 * @callback InsertIntoBuilder
 * @param   { ...(_T_ | Iterable<_T_>) } args
 * @returns SequenceBuilderType<_T_>
 */
