/**
 * @module kolibri.sequence.constructors.unfold
 * The idea was thankfully provided by Daniel Kröni.
 */
import {createMonadicSequence} from "../../sequencePrototype.js";

export { unfold }
/**
 * @typedef StateAndValueType
 * @template _S_, _T_
 * @property { _S_ } state
 * @property { _T_ } value
 */

/**
 * @typedef FromStateToNextStateAndValue
 * @callback
 * @pure The whole idea of `unfold` is to allow a pure function at this point. Depends on developer discipline.
 * @template _S_, _T_
 * @param { _S_ } state
 * @return { StateAndValueType<_S_, _T_> | undefined } - `undefined` if the sequence cannot produce any more values
 */

/**
 * Creates a {@link SequenceType} from a callback function that generates the next state and value from the current state.
 * The sequence is supposed to be exhausted when the callback returns `undefined`.
 * `unfold` abstracts over the proper state management
 * in the closure scope of an {@link Iterable}'s iterator function.
 * This allows the {@link FromStateToNextStateAndValue} callback function to be pure.
 * @template _T_, _S_
 * @param { FromStateToNextStateAndValue<_S_, _T_> } fromStateToNextStateAndValue - callback function to generate the next state and value
 * @param { _S_ } initialState
 * @return { SequenceType<_T_> }
 * @example
 *     const zeroToFour = unfold(0, n => n < 5 ? {state: n + 1, value: n} : undefined);
 *     zeroToFour ['=='] Range(4);
 */
const unfold = (initialState, fromStateToNextStateAndValue) => {

    const iterator = () => {
        let runningState = initialState;

        const next = () => {
            const result = fromStateToNextStateAndValue(runningState);
            if (result === undefined) {
                return { done: true, value: undefined };
            } else {
                runningState = result.state;
                return { done: false, value: result.value };
            }
        };
        return { next };
    };

    return createMonadicSequence(iterator);
};
