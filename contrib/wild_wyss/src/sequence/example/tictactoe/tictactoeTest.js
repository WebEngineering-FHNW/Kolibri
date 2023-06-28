import {TestSuite} from "../../../test/test.js";
import {Computer, hasWon, Human, moves, NoPlayer, opponent, stone} from "./tictactoe.js";
import {Range, map, show, zip, forEach$} from "../../../sequence/sequence.js";
import {arrayEq} from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {iteratorOf} from "../../util/util.js";


const testSuite = TestSuite("Tic Tac Toe Game Tests");


testSuite.add("opponent", assert => {
  assert.is(opponent(Computer), Human);
  assert.is(opponent(Human), Computer);
  assert.is(opponent(NoPlayer), NoPlayer);
});

testSuite.add("stone", assert => {
  assert.is(stone(Computer), 1);
  assert.is(stone(Human), -1);
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

testSuite.run();
