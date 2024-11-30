copied over from 
git@github.com:wildwyss/Kolibri.git 
main branch as of 2023-09-01 T 14:21:43 MESZ

## Changes to the documented API:
- introduce Walk as an alias for Range to support better discovery.
- convenience constructors: Seq(), Seq(42, 99, 1000), Seq(...array); toSeq(iterable)
- rename rejectAll to dropWhere
- rename retainAll to takeWhere
- add tap operator to see each processed value, leaving the sequence unchanged
- foldr: callback args are now switched to (acc, cur) as conventional in JS standard library. 
- sequence of callback arguments in min$/safeMin$ 
- SequenceBuilder is gone, performance tests shows how to use an array as a builder with even better performance.
- moved immutable FocusRing to the examples
- merged sequence/stdlib with the kolibri stdlib and the lambda directory
- removed stackSequence because it had dependencies to the contrib dir that is not published
- added jinq pairWithCtor for better alignment with list comprehensions (now remove pairWith?)

## wishlist
- test against infinite sequence invariants (operator does not stall, lazy, take(0) === nil)
- add docs for divergent sequences ( repeat(1).dropWhere( x => x === 1 ) )
- add alias "flatten" for "mconcat" ? Might suggest deep flattening.
- consider min-/maxWithDefault variants instead of safeMin/-Max, make comparators align with Array.sort?
- since testingTable config.iterable() must be of type sequence - call it "sequenceCtor"?

## todo
- check for better error messages when testing table fails
