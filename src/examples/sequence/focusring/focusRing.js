import {cons, isEmpty, nil, Seq, toSeq} from "../../../kolibri/sequence/sequence.js";

export { FocusRing }

/**
 * Constructs a new immutable focus ring,
 * a data structure to keep a focus in a ring (cycle) of values.
 * Inspired by the XMonad window manager and Simon Peyton Jones' talk
 * {@link https://www.youtube.com/watch?v=jLj1QV11o9g "A Taste of Haskell, OSCON 2007"} .
 * See also {@link https://github.com/Dierk/fregeTutorial/blob/804c0aba82eb60929a36c9a2b5eb08cfd659b45f/src/main/frege/tutorial/FocusRing.fr
 * Frege implementation}
 *
 * __Note:__ The focus ring is immutable. Many operations lead to many objects, which is **not efficient**.
 *
 * @constructor
 * @template _T_
 * @param   { !Iterable<_T_> } nonEmptyIterable - A finite {@link Iterable} which has **at least one element**.
 * @returns { FocusRingType<_T_> }
 */
const FocusRing = nonEmptyIterable => {
  if (isEmpty(nonEmptyIterable)) {
    throw new Error("FocusRing: Can't construct a focus ring from an empty iterable!");
  }
  return FocusRingImpl(nil, toSeq(nonEmptyIterable));
};

/**
 * Constructs a new immutable focus ring using the given {@link Iterable}.
 *
 * @constructor
 * @template _T_
 * @param   { SequenceType<_T_> } pre  - a finite sequence holding the elements left of the focus in reverse order.
 * @param   { SequenceType<_T_> } post - a finite sequence which has at least one element, it's head is the focus.
 * @returns { FocusRingType<_T_> }
 */
const FocusRingImpl = (pre, post) => {

  const focus = () => post.head();

  const right = () => {
    const oldFocus = post.head();
    const tailPost = post.drop(1);

    if (pre.isEmpty() && tailPost.isEmpty()) {                        // only one element in list (the focus): do nothing
      return FocusRingImpl(pre, post);
    }
    if (tailPost.isEmpty()) {                                        // end of list reached: cycle to close the ring
      return FocusRingImpl(Seq(oldFocus), pre.reverse$());
    }
    return FocusRingImpl(cons (oldFocus) (pre), tailPost);        // normal case: move focus to the right
  };

  const left = () => {
    if (pre.isEmpty()) {                                              // the whole list is in the post sequence
      const postReversed = post.reverse$();
      const newFocus     = postReversed.head();
      return FocusRingImpl(postReversed.drop(1), Seq(newFocus));
    }
    return FocusRingImpl(pre.drop(1), cons (pre.head()) (post)); // normal case: pre head becomes focus
  };

  return { focus, left, right }
};
