import { ArrayIterator, emptyIterator }              from "../iterator/iterator.js";
import { reverse$, cons, drop } from "../iterator/intermediateOperations.js";
import { eq$, head, isEmpty } from "../iterator/terminalOperations.js";
export { FocusRing }

/**
 * Constructs a new immutable focus ring.
 * @template _T_
 * @param   { !IteratorType<_T_> } nonEmptyIterator - A finite iterator which has at least one element.
 * @returns { FocusRingType<_T_> }
 * @constructor
 */
const FocusRing = nonEmptyIterator => FocusRingInternal(
  emptyIterator,
  nonEmptyIterator.copy() // paranoid
);

/**
 * Constructs a new immutable focus ring using the given iterators.
 * @template _T_
 * @param   { !IteratorType<_T_> } pre  - a finite iterator
 * @param   { !IteratorType<_T_> } post - a finite iterator which has at least one element, it's head is the focus.
 * @returns { FocusRingType<_T_> }
 * @constructor
 */
const FocusRingInternal = (pre, post) => {
  const focus = () => head(post);

  const right = () => {
    const currentFocus = head(post);
    const modifiedPost = drop(1)(post);

    if (eq$(modifiedPost)(emptyIterator)) {
      if (eq$(pre)(emptyIterator)) {
        // do nothing when only one element in list
        return FocusRingInternal(pre, post);
      }
      return FocusRingInternal(
        ArrayIterator([currentFocus]),
        reverse$(pre)
      );
    }
    const modifiedPre = cons(currentFocus)(pre);
    return FocusRingInternal(modifiedPre, modifiedPost);
  };

  const left = () => {
    let modifiedPre  = pre;
    let modifiedPost = post;

    if (isEmpty(pre)) {
      modifiedPost = emptyIterator;
      modifiedPre  = reverse$(post);
    }

    // remove head from pre and add it to post
    const headPre = head(modifiedPre);
    modifiedPre   = drop(1)(modifiedPre);
    modifiedPost  = cons(headPre)(modifiedPost);

    return FocusRingInternal(modifiedPre, modifiedPost);
  };

  return { focus, left, right }
};