import {cons, drop, head, isEmpty, nil, reverse$, Seq, toSeq} from "../sequence/sequence.js";

export { FocusRing }

/**
 * Constructs a new immutable focus ring.
 *
 * @constructor
 * @template _T_
 * @param   { !Iterable<_T_> } nonEmptyIterable - A finite {@link Iterable} which has **at least one element**.
 * @returns { FocusRingType<_T_> }
 */
const FocusRing = nonEmptyIterable => FocusRingInternal(nil, toSeq(nonEmptyIterable));

/**
 * Constructs a new immutable focus ring using the given {@link Iterable}.
 *
 * @constructor
 * @template _T_
 * @param   { SequenceType<_T_> } pre  - a finite sequence
 * @param   { SequenceType<_T_> } post - a finite sequence which has at least one element, it's head is the focus.
 * @returns { FocusRingType<_T_> }
 */
const FocusRingInternal = (pre, post) => {

  const focus = () => post.head();

  const right = () => {
    const oldFocus = post.head();
    const tailPost = post.drop(1);

    if (pre.isEmpty() && tailPost.isEmpty()) {                        // only one element in list (the focus): do nothing
      return FocusRingInternal(pre, post);
    }
    if (tailPost.isEmpty()) {                                        // end of list reached: cycle to close the ring
      return FocusRingInternal(Seq(oldFocus), pre.reverse$());
    }
    return FocusRingInternal(cons(oldFocus)(pre), tailPost);        // normal case: move focus to the right
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
    modifiedPre   = drop(1)(modifiedPre);          // todo dk: destructive update is not so nice
    modifiedPost  = cons(headPre)(modifiedPost);

    return FocusRingInternal(modifiedPre, modifiedPost);
  };

  return { focus, left, right }
};
