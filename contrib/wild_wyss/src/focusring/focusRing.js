import { ArrayIterator, Iterator } from "../iterator/iterator.js";

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
 * @template _T_
 * @type {IteratorType<_T_>}
 */
const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);

/**
 * Constructs a new immutable focus ring using the given iterators.
 * @template _T_
 * @param   { !IteratorType<_T_> } pre  - a finite iterator
 * @param   { !IteratorType<_T_> } post - a finite iterator which has at least one element, it's head is the focus.
 * @returns { FocusRingType<_T_> }
 * @constructor
 */
const FocusRingInternal = (pre, post) => {
  const focus = () => post.head();

  const right = () => {
    const currentFocus = post.head();
    const modifiedPost = post.copy().drop(1);

    if (modifiedPost.eq$(emptyIterator)) {
      if (pre.eq$(emptyIterator)) {
        // do nothing when only one element in list
        return FocusRingInternal(pre, post);
      }
      return FocusRingInternal(
        ArrayIterator([currentFocus]),
        pre.reverse$()
      );
    }
    const modifiedPre = pre.copy().cons$(currentFocus); // paranoid 2
    return FocusRingInternal(modifiedPre, modifiedPost);
  };

  const left = () => {
    let modifiedPre   = pre.copy();
    let modifiedPost  = post.copy();

    if (pre.isEmpty()) {
      modifiedPost = emptyIterator;
      modifiedPre = post.copy().reverse$();
    }

    // remove head from pre and add it to post
    const headPre = modifiedPre.head();
    modifiedPre   = modifiedPre.drop(1);
    modifiedPost  = modifiedPost.cons$(headPre);

    return FocusRingInternal(modifiedPre, modifiedPost);
  };

  return { focus, left, right }
};