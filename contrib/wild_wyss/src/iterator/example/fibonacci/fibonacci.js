import * as _                 from "../../iterator.js";
import { Range }              from "../../../range/range.js";
import { dom }                from "../../../../../../docs/src/kolibri/util/dom.js";
import { iteratorProjector }  from "../../projector/iteratorProjector.js";
import {FibonacciIterator} from "../../iterator.js";


const fibonacciView = (rootElement, amount) => {
  const iti     = _.take(amount)(FibonacciIterator());
  const iti2    = _.cons(0)(FibonacciIterator());
  const values  = _.zipWith((a, b) => ({current: a, last: b}))(iti)(iti2);
  const indexed = _.zipWith((a, b) => ({index: b, current: a.current, last: a.last}))(values)(Range(100));

  const elements = (iteratorProjector(indexed)(fibonacciProjector(10))).children;

  rootElement.append(...elements);
};

const fibonacciProjector = scaleSactor => ({index, current, last}) => {
  const [div] = dom(`<div>${current}</div>`);
  let top = last * scaleSactor;
  let left = 0;
  if (index % 2 === 0) {
    top = 0;
    left = last * scaleSactor;
  }
  div.style.border    = `1px solid black`;
  div.style.height    = `${current * scaleSactor}px`;
  div.style.width     = `${current * scaleSactor}px`;
  div.style.position  = 'absolute';
  div.style.top       = `${top}px`;
  div.style.left      = `${left}px`;
  return div;
};

const rootElement   = document.getElementById("root");
const amountInput   = document.getElementById("amount");
const amount        = 5;
amountInput.value  = amount;
amountInput.onchange = () => {
  rootElement.innerHTML = '';
  fibonacciView(rootElement, Number(amountInput.value));
};
fibonacciView(rootElement, amount);
