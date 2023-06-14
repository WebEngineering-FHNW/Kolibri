import {
  nil,
  reverse$,
  cons,
  drop,
  eq$,
  head,
  isEmpty,
} from "../sequence/sequence.js"

export { FocusRing }

/**
 * Constructs a new immutable focus ring.
 *
 * @constructor
 * @template _T_
 * @param   { !Iterable<_T_> } nonEmptyIterable - A finite {@link Iterable} which has at least one element.
 * @returns { FocusRingType<_T_> }
 */
const FocusRing = nonEmptyIterable => FocusRingInternal(
  nil,
  nonEmptyIterable
);

/**
 * Constructs a new immutable focus ring using the given {@link Iterable}.
 *
 * @constructor
 * @template _T_
 * @param   { !Iterable<_T_> } pre  - a finite iterable
 * @param   { !Iterable<_T_> } post - a finite iterable which has at least one element, it's head is the focus.
 * @returns { FocusRingType<_T_> }
 */
const FocusRingInternal = (pre, post) => {
  const focus = () => head(post);

  const right = () => {
    const currentFocus = head(post);
    const modifiedPost = drop(1)(post);

    if (eq$(modifiedPost)(nil)) {
      if (eq$(pre)(nil)) {
        // do nothing when only one element in list
        return FocusRingInternal(pre, post);
      }
      return FocusRingInternal(
        [currentFocus],
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
      modifiedPost = nil;
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