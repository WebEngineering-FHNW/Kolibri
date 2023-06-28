import {Range, map, show, zip, forEach$, foldl$, pipe, nil} from "../../../sequence/sequence.js";
import {from} from "../../../jinq/jinq.js";
import {Pair} from "../../../stdlib/pair.js";

export { opponent, stone, Computer, Human, NoPlayer, moves, hasWon}

/**
 * @template _T_
 * @typedef {SequenceType<Tree<_T_>>} TreeSequence
 */

/**
 * @template _T_
 * @typedef { PairSelectorType<_T_, TreeSequence<_T_>> } Tree
 */

/** @type Tree<Number> */
const treePair = Pair(5)(nil);



/**
 * @typedef { "Computer" | "Human" | "NoPlayer" } Player
 */

/**
 * @typedef { 1 | -1 | 0 } Stone
 */

/**
 * @typedef Board
 * @property { Player } whosTurn
 * @property { Array<Stone>} fields - A board has fields from 0 to 8.
 */

/** @type { Player } */
const Computer = "Computer";

/** @type { Player } */
const Human = "Human";

/** @type { Player } */
const NoPlayer = "NoPlayer";

/**
 *
 * @param { Player } player
 * @return Player
 */
const opponent = player => {
  const pairings = {
    "Computer" : Human,
    "Human"    : Computer,
    "NoPlayer" : NoPlayer,
  };
  return pairings[player];
};

/**
 *
 * @param { Player } player
 * @returns Stone
 */
const stone = player => {
  const pairings = {
    "Computer" : 1,
    "Human"    : -1,
    "NoPlayer" : 0,
  };
 return pairings[player];
};

/**
 * @param { Iterable<Stone>} fields
 * @return {SequenceType<PairType<Stone, Number>>}
 */
const indexFields = fields => zip(fields)(Range(1,9));
/**
 *
 * @param { Board } board
 * @return SequenceType<Board>
 */
const moves = board => {
  const otherPlayer = opponent(board.whosTurn);

  const indexedFields = indexFields(board.fields);

  const blankIndices =
    from(indexedFields)
      .where( ([content, _]) => content === stone(NoPlayer))
      .select( ([_, i]) => i)
      .result();


  const fieldsWithPlayerPlacedAt = pos =>
    from(indexedFields)
      .select(([content, i]) => i === pos ? stone(board.whosTurn) : content)
      .result();


  const boardFieldsAfterMove = map(fieldsWithPlayerPlacedAt)(blankIndices);

  return /** @type SequenceType<Board> */ map(fields => ({fields, whosTurn: otherPlayer}) )(boardFieldsAfterMove);
};

/**
 *
 * @type {
 *    (board: Board)
 *    => (player: Player)
 *    => Boolean
 * }
 */
const hasWon = board => player => {
  const winTriples = [
    [1,2,3], [4,5,6], [7,8,9], // row
    [1,4,7], [2,5,8], [3,6,9], // col
    [1,5,9], [3,5,7]           // diag
  ];

  const checkTriple = triple => {
    const actualStone = stone(player);
    const indexedFields = indexFields(board.fields);

    const playerOnFields =
      from(indexedFields)
      .where( ([_, i])        => triple.includes(i))
      .select( ([content, _]) => content === actualStone)
      .result();

    return foldl$((acc, cur) => acc && cur, true)(playerOnFields);
  };
  return pipe(
    map(checkTriple),
    foldl$((acc, cur) => acc || cur, false)
  )(winTriples)
};

/**
 * @template _T_
 * @type {
 *       (unfold: ((_T_) => Iterable<_T_>))
 *    => (a: _T_)
 *    => Tree<_T_>
 * }
 */
const buildTree = unfold => a => {
  const as = unfold(a);
  const children = map(buildTree(unfold))(as);
  return Pair(a)(children);
};

/**
 *
 * @param { Board } board
 * @returns Tree<Board>
 */
const gameTree = board => buildTree(moves)(board);


/**
 *
 * @param { Board } board
 * @returns Number
 */
const staticEval = board => {
  if (hasWon(board)(Computer)) return 1.0;
  if (hasWon(board)(Human))    return -1.0;
  return 0.0 ;
};


const

















