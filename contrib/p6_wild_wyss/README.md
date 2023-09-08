copied over from 
git@github.com:wildwyss/Kolibri.git 
main branch as of 2023-09-01 T 14:21:43 MESZ

## Changes to the documented API:
- introduce Walk as an alias for Range to support better discovery.
- convenience constructors: seq(), seq(42, 99, 1000), seq(...array)

## wishlist
- add each operator to SequencePrototype (requires type modification)
- isSequence
- test against infinite sequence invariants (operator does not stall, lazy, take(0) === nil)
- replace Builder with varargs for cons. 
- add docs for divergent sequences ( repeat(1).dropWhere( x => x === 1 ) )
- add alias "flatten" for "mconcat" ? Might suggest deep flattening.

## todo
- update references in production.js
