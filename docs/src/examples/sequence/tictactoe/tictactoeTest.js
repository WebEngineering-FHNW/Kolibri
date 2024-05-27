import { TestSuite }               from "../../../kolibri/util/test.js";
import { map, Range, zip }         from "../../../kolibri/sequence/sequence.js";
import { Pair}                     from "../../../kolibri/lambda/pair.js";
import { Computer, evaluate, hasWon, Human, moves, NoPlayer, opponent, stone, treeMap }
                                   from "./tictactoe.js";
import { iteratorOf}               from "../../../kolibri/sequence/util/helpers.js";

const testSuite = TestSuite("examples/sequence/tictactoe");

testSuite.add("opponent", assert => {
  assert.is(opponent(Computer), Human);
  assert.is(opponent(Human),    Computer);
  assert.is(opponent(NoPlayer), NoPlayer);
});

testSuite.add("stone", assert => {
  assert.is(stone(Computer), 1);
  assert.is(stone(Human),   -1);
  assert.is(stone(NoPlayer), 0);
});

testSuite.add("moves", assert => {
  const fields = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];
  const sampleBoard = {
    fields: fields,
    whosTurn: Computer
  };

  const idxBoard = zip(fields)(Range(8));
  const expected = Range(8).pipe(
    map(n => map( ([p,i]) => n === i ? 1 : p)(idxBoard)),
    map(fields => ({ fields, whosTurn: Human}))
  );

  const result = moves(sampleBoard);

  const expectedIt = iteratorOf(expected);
  const resultIt = iteratorOf(result);

  for (let i = 0; i < 8; i++) {
    assert.iterableEq(resultIt.next().value.fields, expectedIt.next().value.fields)
  }
  const fieldsWonCPU = [ 1, 1, 1, 0, 0, 0, 0, 0, 0 ];
  const sampleBoardWonCPU= { fields: fieldsWonCPU, whosTurn: Human };

  const fieldsWonHuman = [ -1, -1, -1, 0, 0, 0, 0, 0, 0 ];
  const sampleBoardWonHuman = { fields: fieldsWonHuman, whosTurn: Human };

  assert.iterableEq(moves(sampleBoardWonCPU), []);
  assert.iterableEq(moves(sampleBoardWonHuman), []);
});

testSuite.add("hasWon", assert => {
  const fields = [
    [
      1, 1, 1,
      0, 0, 0,
      0, 0, 0
    ],
    [
      0, 0, 0,
      1, 1, 1,
      0, 0, 0,
    ],
    [
      0, 0, 0,
      0, 0, 0,
      1, 1, 1,
    ],
    [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ],
    [
      0, 0, 1,
      0, 1, 0,
      1, 0, 0,
    ],
    [
      1, 0, 0,
      1, 0, 0,
      1, 0, 0
    ],
    [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ],
    [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ],
  ];

  const boards = map(fields => ({fields, whosTurn: Computer }))(fields);

  for (const board of boards) {
     assert.isTrue(hasWon(board)(Computer));
  }
});

testSuite.add("test treemap", assert => {
  const tree = Pair(5)([
      Pair(2)([
        Pair(1)([])
      ]),
      Pair(3)([])
  ]);

  const [h1, seq1]   = treeMap(x => 2*x)(tree);
  const [sub1, sub2] = seq1;
  const [h2, seq2]   = sub1;
  const [h3, _1]     = sub2;
  const [[h4, _2]]   = seq2;
  assert.iterableEq([h1, h2, h3, h4], [10, 4, 6, 2])
});


testSuite.add("test evaluate", assert => {
  // Computer has no chance here - it must lay its stone in the lower right corner nad in the middle line on the left side
  const field = [
      -1, 1, 1,
       0, 0, 0, // human will set to the middle
       0, 0, 0
  ];

  const board = {
    whosTurn: Human,
    fields: field
  };
  assert.is(evaluate(1)(board),  0);
  assert.is(evaluate(5)(board), -1);
});

testSuite.run();
