copied over from 
git@github.com:wildwyss/Kolibri.git 
main branch as of 2023-09-01 T 14:21:43 MESZ

## Changes to the documented API:
- introduce Walk as an alias for Range to support better discovery.
- convenience constructors: seq(), seq(42, 99, 1000), seq(...array)
- rename rejectAll to dropWhere
- rename retainAll to takeWhere
- add tap operator to see each processed value, leaving the sequence unchanged
- foldr: callback args are now switched to (acc, cur) as conventional in JS standard library. 
- sequence of callback arguments in min$/safeMin$ (

## wishlist
- add each operator to SequencePrototype (requires type modification)
- isSequence
- test against infinite sequence invariants (operator does not stall, lazy, take(0) === nil)
- replace Builder with varargs for cons. 
- add docs for divergent sequences ( repeat(1).dropWhere( x => x === 1 ) )
- add alias "flatten" for "mconcat" ? Might suggest deep flattening.
- for zip, zipWith and pairWith consider using a sequence of two elements instead of a pair.
- make an forEach alias for better discovery and jsdoc support? 
- consider min-/maxWithDefault variants instead of safeMin/-Max

## todo
- update references in production.js
