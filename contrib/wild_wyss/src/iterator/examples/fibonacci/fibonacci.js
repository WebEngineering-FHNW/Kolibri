import * as _                               from "../../iterator.js";
import { Range }                            from "../../../range/range.js";
import { dom }                              from "../../../../../../docs/src/kolibri/util/dom.js";
import { iteratorProjector }                from "../../projector/iteratorProjector.js";
import { AngleIterator, FibonacciIterator } from "../../iterator.js";

const fibonacciView = (rootElement, amount, scaleFactor) => {
  const fibSequence = _.take(amount)(FibonacciIterator());
  const position    = _.cons(0)(FibonacciIterator()); // position of square is one behind the squares value
  const values      = _.zipWith((a, b) => ({current: a, pos: b}))(fibSequence)(position);
  const indexed     = _.zipWith((a, b) => ({...a, index: b}))(values)(Range(100));
  const colored     = _.zipWith((a, b) => ({...a, color: b}))(indexed)(AngleIterator(amount));

  const elements = (iteratorProjector(colored)(fibonacciProjector(scaleFactor))).children;

  rootElement.append(...elements);
};

const fibonacciProjector = scaleFactor => ({ index, current, pos, color }) => {
  const [div] = dom(`<div>${current}</div>`);
  let top = pos * scaleFactor;
  let left = 0;
  if (index % 2 === 0) {
    top = 0;
    left = pos * scaleFactor;
  }
  div.style.border     = `1px solid black`;
  div.style.height     = `${current * scaleFactor}px`;
  div.style.width      = `${current * scaleFactor}px`;
  div.style.position   = 'absolute';
  div.style.top        = `${top}px`;
  div.style.left       = `${left}px`;
  div.style.background = `hsl(${color},100%,50%)`;
  return div;
};

const rootElement   = document.getElementById("root");
const amountInput   = document.getElementById("amount");
const scaleInput    = document.getElementById("scale");
let amount          = 5;
let scaleFactor     = 10;

amountInput.value = amount;
amountInput.onchange = () => {
  rootElement.innerHTML = '';
  amount = Number(amountInput.value);
  fibonacciView(rootElement, amount, scaleFactor);
};

scaleInput.onchange = () => {
  rootElement.innerHTML = '';
  scaleFactor = Number(scaleInput.value);
  fibonacciView(rootElement, amount, scaleFactor);
};

fibonacciView(rootElement, amount, scaleFactor);