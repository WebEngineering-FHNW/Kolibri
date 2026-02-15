import {createMonadicSequence} from "../../sequencePrototype.js";
import {iteratorOf}            from "../../util/helpers.js";

export { scan }


/**
 * Transforms each element using the given {@link FunctionType function} `f` and `startValue` just as
 * if we would have replaced each element with `foldl$(f,startValue)` on an iterable that ends with the current element.
 * However, while a naïve implementation would result in an O(n*n) complexity, `scan` runs in O(n)
 * for n elements.
 *
 * Typical use cases are partial sums and any kind of operation that wants to keep track of
 * how the history of calculating steps led to the next value.
 * It is also a device that can "carry state" from one element to the next.
 *
 * @function
 * @pure    as long as the binOperator is pure
 * @haskell (a -> b) -> b -> [a] -> [b]
 * @typedef ScanOperationType
 * @template _T_
 * @template _U_
 * @type { <_T_, _U_>
 *            (binOperator: BiFunction<_U_, _T_, _U_>, startValue: _U_)
 *         => SequenceOperation<_T_, _U_>
 *       }
 *
 * @example
 *     const partialSum = scan(plusOp, 0);
 *     const result     = partialSum(Seq(1, 1, 1, 1, 1));
 *     assert.iterableEq(result, Seq(1, 2, 3, 4, 5));
 */

/**
 * see {@link ScanOperationType}
 * @template _T_
 * @template _U_
 * @type { ScanOperationType<_T_, _U_> }
 */

const scan = (binOperator, startValue) => iterable => {

    const scanIterator = () => {
        const inner = iteratorOf(iterable);

        let nextValue = startValue;
        const next    = () => {
            const {done, value} = inner.next();
            if (done) {
                return {done};
            }
            nextValue = binOperator(nextValue, value);
            return { /**@type boolean */ done, value: nextValue};
        };

        return {next};
    };

    return createMonadicSequence(/** @type { <_U_> () => Iterator<_U_> } */ scanIterator);
};
