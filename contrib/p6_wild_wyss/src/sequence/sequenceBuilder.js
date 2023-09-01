import { nil }                   from "./constructors/nil/nil.js";
import { createMonadicSequence } from "./util/sequenceUtil/createMonadicSequence.js";
import { isIterable }            from "./util/sequenceUtil/isIterable.js";
import { iteratorOf }            from "./util/sequenceUtil/iteratorOf.js";

export { SequenceBuilder }

const ALREADY_BUILT_ERROR_MESSAGE = "Unsupported operation: Sequence has already been built!";

/**
 * A mutable builder for an {@link SequenceType}.
 * This allows the creation of an {@link SequenceType} by generating elements individually and adding them to the Builder (without the recursion overhead that comes from using {@link cons}).
 * Using the {@link SequenceBuilderType} allows you to construct {@link SequenceType} with many elements over time.
 * An {@link SequenceBuilderType} has a lifecycle, which starts in a building phase, during which elements can be added, and then transitions to a built phase, after which elements may not be added.
 * The built phase begins when the `build()` method is called, which creates {@link SequenceType} whose elements are the elements that were added to the {@link SequenceBuilderType}.
 *
 *
 * **Consider the following:**
 * - Build must only be called at most once. After the first time, `build()` returns an {@link nil}.
 * - After build has been called, no elements can be added.
 *
 * @constructor
 * @pure
 * @template _T_
 * @param  { Iterable<_T_> } start
 * @returns { SequenceBuilderType<_T_> }
 * @throws { string } if any method on this {@link SequenceBuilderType} is called when the {@link Iterable} is in built phase.
 *
 * @example
 * const range = Range(3);
 * const it = SequenceBuilder()
 * .append(range)
 * .append(4)
 * .append(5,6,7)
 * .build();
 *
 * console.log(...it);
 * // => Logs '0, 1, 2, 3, 4, 5, 6, 7'
 */
const SequenceBuilder = (start = nil) => {
  /**
   * @template _T_
   * @type { Array<Iterable<_T_> | _T_> }
   */
  const elements = [start];
  let built      = false;

  const append  = (...args) => {
    checkIfBuilt();
    elements.push(...args);
    return builder;
  };

  const prepend  = (...args) => {
    checkIfBuilt();
    elements.unshift(...args);
    return builder;
  };

  const build = () => {
    checkIfBuilt();
    built = true;
    return toMonadicIterable(elements);
  };

  const builder = { append, prepend, build };

  const checkIfBuilt = () => {
    if (built) {
      throw new Error(ALREADY_BUILT_ERROR_MESSAGE);
    }
  };

  return builder;
};

/**
 * Creates an {@link SequenceType} from any {@link Iterable} or {@link Iterable} of {@link Iterable Iterables}.
 *
 * @template _T_
 * @param { _T_ | Iterable<_T_> | Iterable<Iterable<_T_>>} elements
 * @returns { SequenceType<_T_> }
 * @constructor
 */
const toMonadicIterable = elements => {
  elements = isIterable(elements) ? elements : [elements];

  /**
   *
   * @template _T_
   * @returns { Iterator<_T_> }
   */
  const iterator = () => {
    let currentIdx = 0;
    let currentIterator = undefined;

    const next = () => {
      while (isIterable(elements[currentIdx])) {
        if (currentIterator === undefined) {
          // process next iterator
          currentIterator = iteratorOf(elements[currentIdx]);
        }

        const result = currentIterator.next();

        if (result.done) {
          currentIterator = undefined;
          currentIdx++;
        } else {
          return result;
        }
      }

      // if all elements of the iterator have been processed
      if (currentIdx === elements.length) {
        return { done: true, value: undefined };
      }

      return { done: false, value: elements[currentIdx++] };
    };

    return { next };
  };

  return createMonadicSequence(iterator);
};