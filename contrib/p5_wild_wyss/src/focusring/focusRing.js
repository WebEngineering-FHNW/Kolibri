import { ArrayIterator, Iterator } from "../iterator/iterator.js";

export { FocusRing }

const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);

const FocusRing = nonEmptyIterator => FocusRingInternal(
  emptyIterator,
  nonEmptyIterator.copy() // paranoid
);

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