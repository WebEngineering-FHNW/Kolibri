import { dom } from "../../../../../docs/src/kolibri/util/dom.js";
import * as _  from "../iterator.js";

export { FizzBuzzView }

const FizzBuzzView = (controller, rootElement) => {
  const [addButton]     = dom(`<button>Add Rule</button>`);
  const [rulesRoot]     = dom(`<div></div>`);
  const [resultRoot]    = dom(`<div></div>`);

  const renderRules = rules => {
    const ruleElements = rules.map(rule => ruleProjector(rule));
    rulesRoot.replaceChildren(...ruleElements);
  };

  const renderResult = result => resultRoot.replaceChildren(resultProjector(controller, result));

  const sliders = boundaryProjector(controller);

  controller.onRulesChange (renderRules);
  controller.onResultChange(renderResult);

  addButton  .onclick = () => controller.addRule();
  rootElement.append(rulesRoot, sliders, addButton, resultRoot);
};

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

const resultProjector = (controller, result) => {
  const [numberedList] = dom(`<ol start="${controller.getLowerBoundary()}"></ol>`);
  numberedList.append(..._.map(el => dom(`<li>${el}</li>`)[0])(result));
  return numberedList;
};

const ruleNrProjector = rule => {
  const [numberInput] = dom(`<input type="number" value="${rule.getNr()}">`);
  numberInput.oninput = () => rule.setNr(Number(numberInput.value));

  rule.onNrChanged(newValue => numberInput.value = newValue);
  return numberInput;
};

const ruleTextProjector = rule => {
  const [textInput]  = dom(`<input value="${rule.getText()}">`);
  textInput.onchange = () => rule.setText(textInput.value);

  rule.onTextChanged(newValue => textInput.value = newValue);
  return textInput;
};

const ruleProjector = rule => {
  const container = document.createElement("DIV");
  container.append(
    ruleNrProjector(rule),
    ruleTextProjector(rule)
  );
  return container;
};
