copied over from 
git@github.com:wildwyss/Kolibri.git 
main branch as of 2023-09-01 T 14:21:43 MESZ

## Changes to the documented API:
- introduce Walk as an alias for Range to support better discovery.

## wishlist
- add each operator to SequencePrototype (requires type modification)
- isSequence
- seq(0,1,2,3)
- test against infinite sequence invariants (operator does not stall, lazy, take(0) === nil)
