import {TestSuite}                   from "../../../util/test.js";
import {map, nil, Range, Seq, }      from "../../sequence.js";
import {Just, Nothing}               from "../../../stdlib.js";

const testSuite = TestSuite("Sequence Prototype Suite");

testSuite.add("test prototype: and", assert => {
  const result = Range(0, 3).and(el => Range(0, el));

  assert.iterableEq(result, [0, 0, 1, 0, 1, 2, 0, 1, 2, 3]);
});

testSuite.add("test prototype: fmap", assert => {
  const result = Range(0, 3).fmap(x => 2 * x);

  assert.iterableEq(result, [0, 2, 4, 6]);
});

testSuite.add("test prototype: pure", assert => {
  const singleton = Seq().pure(3);
  assert.iterableEq(singleton, [3]);
});

testSuite.add("test prototype: empty", assert => {
  const result = nil.empty();

  assert.iterableEq(result, []);
});


testSuite.add("test prototype: toString, show", assert => {
  const range = Range(0, 3);

  assert.is(range.toString(), range.show());

  // noinspection JSCheckFunctionSignatures
  assert.is(range.toString(2), range.show(2));
});

testSuite.add("test prototype: [==], eq$", assert => {
  assert.isTrue(Range(0, 3).eq$    (Range(0, 3)));
  assert.isTrue(Range(0, 3) ["=="] (Range(0, 3)));
});

testSuite.add("test prototype: pipe", assert => {
  // Given
  const double   = x => 2 * x;
  // When
  const actual = Seq(1, 2).pipe(
      map(double),
      map(double)
  );
  // Then
  assert.iterableEq(actual, Seq(4, 8));
});

testSuite.add("test prototype: cons", assert => {

  assert.iterableEq(Seq(1,2,3).cons(0), Seq(0,1,2,3));

  // see whether type inspection can handle this
  assert.iterableEq(
      Seq(3)
        .cons(2)
        .cons(1)
        .and(el => Seq(el, -el))
        .cons(0),
      Seq(0, 1, -1, 2, -2, 3, -3)
  );
});

testSuite.add("operator tests", assert => {

  assert.iterableEq(Seq(1).append(Seq(2,3)),                     Seq(1, 2, 3));
  assert.iterableEq(Seq(1,2) ['++'](Seq(3)),                     Seq(1, 2, 3));
  assert.iterableEq(Seq(Just(1), Nothing, Just(2)).catMaybes() , Seq(1, 2));
  assert.iterableEq(Seq(1,2).cycle().take(4),                    Seq(1, 2, 1, 2));
  assert.iterableEq(Seq(1, 2, 3).drop(2),                        Seq(3));
  assert.iterableEq(Seq(1, 2, 0).dropWhere(x => x > 1),          Seq(1, 0));
  assert.iterableEq(Seq(1, 2, 3).dropWhile(x => x < 3),          Seq(3));
  assert.iterableEq(Seq(1, 2).map(x => x * 2),                   Seq(2, 4));
  assert.iterableEq(Seq( Seq(1), Seq(2,3)).mconcat(),            Seq(1,2,3));
  assert.iterableEq(Seq(1, 3, 2).takeWhere(x => x < 3),          Seq(1, 2));
  assert.iterableEq(Seq(0, 1, 2, 0).takeWhile(x => x < 2),       Seq(0, 1));

  assert.iterableEq(Seq(1, 2).zip("ab").map(([x, y]) => ""+x+y), Seq("1a", "2b"));

});

testSuite.run();
