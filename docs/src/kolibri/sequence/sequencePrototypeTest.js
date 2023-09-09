import {TestSuite}                                                 from "../util/test.js";
import {map, show, nil, Range, Seq, drop, take, Sequence, reduce$} from "./sequence.js";
import {Just, Nothing}                                             from "../stdlib.js";

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
  assert.iterableEq(Seq(1, 2, 3).reverse$(),                     Seq(3, 2, 1));
  assert.iterableEq(Seq(1, 2).snoc(3),                           Seq(1, 2, 3));
  assert.iterableEq(Seq(1, 3, 2).takeWhere(x => x < 3),          Seq(1, 2));
  assert.iterableEq(Seq(0, 1, 2, 0).takeWhile(x => x < 2),       Seq(0, 1));
  assert.iterableEq(Seq(1, 2).zip("ab").map(([x, y]) => ""+x+y), Seq("1a", "2b"));
  assert.iterableEq(Seq(1, 2).zipWith((x, y) => ""+x+y)("ab"),   Seq("1a", "2b"));

  let sum = 0;
  assert.iterableEq(
      Seq(1,2)
          .cycle()
          .tap(x => sum += x)
          .take(4),
      Seq(1, 2, 1, 2));
  assert.is(sum, 6);

});

testSuite.add("test prototype: terminal operations", assert => {
    assert.is(Seq(1, 2, 3).foldr$ ((acc, cur) => "" + acc + cur, ""), "321");
    assert.is(Seq(1, 2, 3).reduce$((acc, cur) => "" + acc + cur, ""), "123");
    assert.is(Seq(1, 2, 3).head(),      1);
    assert.is(nil.head(),               undefined);
    assert.is(nil.isEmpty(),            true);
    assert.is(Seq(1).isEmpty(),         false);
    assert.is(Seq(1,2,3).max$(),         3);
    assert.is(show(Seq(1,2,3).uncons()), "[1,[2,3]]");

    let x = "";
    Seq("x","xx")
        .safeMax$( (a,b) => a.length < b.length)
          ( _ => x ="error")
          ( n => x = n);
    assert.is(x, "xx");

    assert.is(Seq("x","xxx","xx").min$( (a,b) => a.length <  b.length), "x");

    let y = undefined;
    Seq(3,1,2)
        .safeMin$()
          ( _ => y = -1)
          ( n => y =  n);
    assert.is(y, 1);

    const consumed = [];
    Seq(1,2,3).forEach$(x => consumed.push(x));
    assert.iterableEq(consumed, [1,2,3]);
});

testSuite.add("test prototype: composition", assert => {

    const slice = (begin, len) => [       // "composed" operator
        drop(begin),
        take(len)
    ];
    const sort = iterable => Seq(...[...iterable].sort());
    assert.iterableEq(
        Range(1000)
            .pipe(...slice(50,2))           // how to use a composed operator
            .cycle()
            .take(4)
            // .tap(x => console.log(x))    // uncomment for debugging
            .pipe(sort),                    // custom operator
        Seq(50, 50, 51, 51));

    const count = reduce$( acc => acc + 1, 0);
    const collatz = x => Sequence(
        x,
        n => n > 2,
        n => n % 2 === 0
             ? n / 2
             : 3 * n + 1);

    const result = Range(2, 100_000)
        .map(n => [n, count(collatz(n))] )
        .max$((a, b) => a[1] < b[1]);
    assert.iterableEq(result, [77031, 349]);

});

testSuite.run();
