import { dom }               from "../../../../../../docs/src/kolibri/util/dom.js";
import { sequenceProjector } from "../../projector/sequenceProjector.js";

export { FizzBuzzView }

/**
 *
 * @param { FizzBuzzControllerType } controller
 * @param { HTMLElement } rootElement
 */
const FizzBuzzView = (controller, rootElement) => {
  const [addButton]                = dom(`<button style="margin-top: 5px">Add Rule</button>`);
  const [rulesHeader, rulesRoot]   = dom(`<h3>Rules</h3><div></div>`);
  const [resultHeader, resultRoot] = dom(`<h3>Result</h3><div></div>`);

  const boundaryElements = boundaryProjector(controller);
  const renderResult = result => resultRoot.replaceChildren(resultProjector(controller, result));
  const renderRules  = rules => {
    const ruleElements = rules.map(rule => ruleProjector(rule));
    rulesRoot.replaceChildren(...ruleElements);
  };

  controller.onRulesChange (renderRules);
  controller.onResultChange(renderResult);

  addButton  .onclick = () => controller.addRule();
  rootElement.append(rulesHeader, rulesRoot, addButton, boundaryElements, resultHeader, resultRoot);
};

/**
 * @param   { FizzBuzzControllerType } controller
 * @returns { HTMLElement }
 */
const boundaryProjector = controller => {
  const [container]  = dom(`<div></div>`);
  const [header]     = dom(`<h3>Range</h3>`);
  const [body]       = dom(`<div class="rangeGrid"></div>`);
  const [labelUpper] = dom(`<label for="upper">to: </label>`);
  const [labelLower] = dom(`<label for="lower">from: </label>`);
  const [upperInput] = dom(`<input type="number" value="${controller.getUpperBoundary()}" id="upper" class="numberInput">`);
  const [lowerInput] = dom(`<input type="number" value="${controller.getLowerBoundary()}" id="lower" class="numberInput">`);

  upperInput.onchange = _ => controller.setUpperBoundary(Number(upperInput.value));
  lowerInput.onchange = _ => controller.setLowerBoundary(Number(lowerInput.value));

  controller.onLowerBoundaryChange(value => lowerInput.value = value);
  controller.onUpperBoundaryChange(value => upperInput.value = value);

  body.append(labelLower, lowerInput,labelUpper, upperInput);
  container.append(header, body);
  return container;
};

/**
 *
 * @param   { FizzBuzzControllerType } controller
 * @param   { SequenceType<RuleType> } result
 * @returns { HTMLElement }
 */
const resultProjector = (controller, result) => {
  const [numberedList] = dom(`<ol start="${controller.getLowerBoundary()}"></ol>`);
  numberedList.append(...sequenceProjector(result)(row => dom(`<li>${row}</li>`)[0]).children);
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
  const [container]= dom(`<div class="rulesGrid"></div>`);
  container.append(
    ruleNrProjector(rule),
    ruleTextProjector(rule)
  );
  return container;
};