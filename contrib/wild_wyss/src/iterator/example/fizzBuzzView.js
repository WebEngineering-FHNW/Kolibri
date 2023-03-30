import { dom } from "../../../../../docs/src/kolibri/util/dom.js";
import * as _  from "../iterator.js";

export { FizzBuzzView }

/**
 *
 * @param { FizzBuzzControllerType } controller
 * @param { HTMLElement } rootElement
 */
const FizzBuzzView = (controller, rootElement) => {
  const [addButton]     = dom(`<button>Add Rule</button>`);
  const [rulesRoot]     = dom(`<div></div>`);
  const [resultRoot]    = dom(`<div></div>`);

  const boundaryElements = boundaryProjector(controller);
  const renderResult     = result => resultRoot.replaceChildren(resultProjector(controller, result));
  const renderRules      = rules => {
    const ruleElements = rules.map(rule => ruleProjector(rule));
    rulesRoot.replaceChildren(...ruleElements);
  };


  controller.onRulesChange (renderRules);
  controller.onResultChange(renderResult);

  addButton  .onclick = () => controller.addRule();
  rootElement.append(rulesRoot, boundaryElements, addButton, resultRoot);
};

/**
 * @param   { FizzBuzzControllerType } controller
 * @returns { HTMLElement }
 */
const boundaryProjector = controller => {
  const [container]  = dom(`<div></div>`);
  const [labelUpper] = dom(`<label for="upperSlider">to: </label>`);
  const [labelLower] = dom(`<label for="lowerSlider">from: </label>`);
  const [upperInput] = dom(`<input type="number" value="${controller.getUpperBoundary()}" id="upperSlider">`);
  const [lowerInput] = dom(`<input type="number" value="${controller.getLowerBoundary()}" id="lowerSlider">`);

  upperInput.onchange = _ => controller.setUpperBoundary(Number(upperInput.value));
  lowerInput.onchange = _ => controller.setLowerBoundary(Number(lowerInput.value));

  controller.onLowerBoundaryChange(value => lowerInput.value = value);
  controller.onUpperBoundaryChange(value => upperInput.value = value);

  container.append(labelLower, lowerInput, labelUpper, upperInput);
  return container;
};

/**
 *
 * @param   { FizzBuzzControllerType } controller
 * @param   { IteratorType<RuleType> } result
 * @returns { HTMLElement }
 */
const resultProjector = (controller, result) => {
  const [numberedList] = dom(`<ol start="${controller.getLowerBoundary()}"></ol>`);
  numberedList.append(..._.map(el => dom(`<li>${el}</li>`)[0])(result));
  return numberedList;
};

/**
 * @param   { RuleType } rule
 * @returns { HTMLElement }
 */
const ruleNrProjector = rule => {
  const [numberInput] = dom(`<input type="number" value="${rule.getNr()}">`);
  numberInput.oninput = () => rule.setNr(Number(numberInput.value));

  rule.onNrChanged(newValue => numberInput.value = newValue);
  return numberInput;
};


/**
 * @param   { RuleType } rule
 * @returns { HTMLElement }
 */
const ruleTextProjector = rule => {
  const [textInput]  = dom(`<input value="${rule.getText()}">`);
  textInput.onchange = () => rule.setText(textInput.value);

  rule.onTextChanged(newValue => textInput.value = newValue);
  return textInput;
};

/**
 * @param   { RuleType } rule
 * @returns { HTMLElement }
 */
const ruleProjector = rule => {
  const container = document.createElement("DIV");
  container.append(
    ruleNrProjector(rule),
    ruleTextProjector(rule)
  );
  return container;
};
