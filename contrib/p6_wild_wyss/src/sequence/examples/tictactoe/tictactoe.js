import { Range, map, zip, foldl$, pipe, nil, max$, min$, isEmpty } from "../../../sequence/sequence.js";
import { from } from "../../../jinq/jinq.js";
import { Pair } from "../../../stdlib/pair.js";
import { snd } from "../../../../../../docs/src/kolibri/stdlib.js";

export { nextBoard, nowValue, opponent, stone, Computer, Human, NoPlayer, moves, hasWon, treeMap, evaluate }

/**
 * @template _T_
 * @typedef {SequenceType<Tree<_T_>>} TreeSequence
 */

/**
 * @template _T_
 * @typedef { PairSelectorType<_T_, TreeSequence<_T_>> } Tree
 */

const treeMap = f => ([a, sub]) => Pair(f(a))(map(treeMap(f))(sub));

/**
 * @typedef { "Computer" | "Human" | "NoPlayer" } Player
 */

/**
 * @typedef { 1 | -1 | 0 } Stone
 */

/**
 * @typedef Board
 * @property { Player } whosTurn
 * @property { Iterable<Stone>} fields - A board has fields from 0 to 8.
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
  if (hasWon(board)(Computer)) return /**@type {SequenceType<Board>} */nil;
  if (hasWon(board)(Human))    return /**@type {SequenceType<Board>} */nil;

  const otherPlayer   = opponent(board.whosTurn);
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
    const actualStone   = stone(player);
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
  return 0.0;
};

/**
 * @template _T_
 * @param { Tree<_T_>}
 * @return { _T_ }
 */
const maximize = ([a, sub]) => {
  if (sub ["=="] (nil)) return a;
  return max$ (map(minimize)(sub))
};

/**
 * @template _T_
 * @param { Tree<_T_>}
 * @return { _T_ }
 */
const minimize = ([a, sub]) => {
  if (sub ["=="] (nil)) return a;
  return min$ (map(maximize)(sub))
};

/**
 *
 * @template _T_
 * @type {
 *           (n: Number)
 *        => (tree: Tree<_T_>)
 *        => Tree<_T_>
 * }
 * @param n
 */
const prune = n => tree => {
  const [a, sub] = tree;
  if (n === 0) return Pair(a)(nil);
  else return Pair(a)(map(prune(n-1))(sub));
};

/**
 * Evaluates a given Board by building a tree
 * @type {
 *            (lookahead: Number)
 *         => (board: Board)
 *         => Number
 * }
 */
const evaluate = lookahead => board => {
  const prunedTree = prune(lookahead)(gameTree(board));
  const mappedTree = treeMap(staticEval)(prunedTree);
  return minimize(mappedTree);
};

/**
 * @template _T_
 * @type {
 *            (LOOK_AHEAD: Number)
 *         => (board: Board)
 *         => PairSelectorType<_T_, Board>
 * }
 */
const nowValue = lookahead => board =>
  Pair(evaluate(lookahead)(board))(board);

const nextBoard = lookahead => inFields => {
  const currentBoard = { whosTurn: Computer, fields: inFields };

  // get all possible
  const possibleMoves  = moves (currentBoard);
  if (isEmpty(possibleMoves)) return currentBoard;
  // evaluate each move by looking ahead how good it is
  let evaluatedMoves = /** @type {SequenceType<PairSelectorType<Number, Board>>} */ map (nowValue(lookahead)) (possibleMoves);

  // if the computer is sure to lose, only look one place ahead to prevent the "nearest" loss
  if (onlyLoses(evaluatedMoves)) {
    evaluatedMoves = map (nowValue(1)) (possibleMoves);
  }

  /**
   * Gets the highest ranked board of the passed board
   * @param {SequenceType<PairSelectorType<Number, Board>>} boards
   * @return Board
   */
  return bestOf(evaluatedMoves);
};

// noinspection JSCheckFunctionSignatures
/**
 * Returns true if every move of the computer ends in its defeat
 *
 * @param { SequenceType<PairSelectorType<Number, Board>> } boards
 * @returns boolean
 */
const onlyLoses = boards =>
  boards.pipe(
    map(([v, _]) => v),
    foldl$((acc, cur) => acc && cur === -1, true)
  );

/**
 * gets the best possible turn for the computer from possible boards
 * @param { SequenceType<PairSelectorType<Number, Board>> } boards
 * @return Board
 */
const bestOf = boards => {
  if (isEmpty(boards)) return { whosTurn: NoPlayer, fields: [] };
  const max = /** @type {PairSelectorType} */ max$(boards, ([a, _b1],[b, _b2]) => a < b );
  // noinspection JSValidateTypes
  return max(snd);
};
