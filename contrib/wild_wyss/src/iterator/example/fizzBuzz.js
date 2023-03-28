import { dom }              from "../../../../../docs/src/kolibri/util/dom.js";
import * as _               from "../iterator.js";
import { emptyIterator }    from "../iterator.js";
import { Attribute, VALUE } from "../../../../../docs/src/kolibri/presentationModel.js";
import { Observable }       from "../../../../../docs/src/kolibri/observable.js";

export { Controller, View }


const Rule = (nr = 1, text = "") => {
  const nrAttr    = Attribute(nr);
  const textAttr  = Attribute(text);

  return {
    getNr:          nrAttr.getObs(VALUE).getValue,
    setNr:          nrAttr.setConvertedValue,
    onNrChanged:    nrAttr.getObs(VALUE).onChange,
    getText:        textAttr.getObs(VALUE).getValue,
    setText:        textAttr.getObs(VALUE).setValue,
    onTextChanged:  textAttr.getObs(VALUE).onChange
  }
};

const FizzBuzzModel = () => {
  const rules         = Observable([]);
  const result        = Observable(emptyIterator);
  const upperBoundary = Observable(30);
  const lowerBoundary = Observable(1);

  const addRule = rule => rules.setValue([...rules.getValue(), rule]);
  const delRule = rule => rules.setValue([...rules.getValue().filter(r => r !== rule)]);

  return {
    addRule,
    delRule,
    rulesSnapshot:         rules.getValue,
    onRulesChange:         rules.onChange,
    setResult:             result.setValue,
    onResultChange:        result.onChange,
    setUpperBoundary:      upperBoundary.setValue,
    setLowerBoundary:      lowerBoundary.setValue,
    getUpperBoundary:      upperBoundary.getValue,
    getLowerBoundary:      lowerBoundary.getValue,
    onUpperBoundaryChange: upperBoundary.onChange,
    onLowerBoundaryChange: lowerBoundary.onChange,
  }
};

const Controller = () => {
  const model   = FizzBuzzModel();
  const addRule = (nr, text) =>{
    const rule = Rule(nr,text);
    rule.onTextChanged(buildFizzBuzz);
    rule.onNrChanged(buildFizzBuzz);
    model.addRule(rule);
  };

  const infinitNumbers = _.Iterator(1, i => i + 1, _ => false);

  const createIteratorForRule = rule =>
    _.pipe(infinitNumbers)(
      _.map(a => a === rule.getNr() ? rule.getText() : ""),
      _.take(rule.getNr()),
      _.cycle
    );

  const buildFizzBuzz = () => {
    const currentRules = model.rulesSnapshot().map(createIteratorForRule);

    const baseLine  = _.Iterator("", _ => "", _ => false);
    const rules     = _.ArrayIterator(currentRules);

    const fizzBuzz  = _.pipe(rules)(
      _.reduce$((acc, cur) => _.cons(cur)(acc), _.ArrayIterator([])), // cons all rules into an iterator of iterators
      _.reverse$,
      _.reduce$((acc, cur) => _.zipWith((a, b) => a + b)(acc)(cur), baseLine), // combine to single iterator
      _.zipWith((numbers, pattern) => pattern === "" ? String(numbers) : pattern)(infinitNumbers), // add numbers where no text is present
      _.take(model.getUpperBoundary()),
      _.drop(model.getLowerBoundary() -1),
    );

    model.setResult(fizzBuzz);
  };

  model.onUpperBoundaryChange((value, oldValue) => {
    if (value < 0) model.setUpperBoundary(oldValue);
    if (value < model.getLowerBoundary()){
      const newLower = model.getLowerBoundary() - (oldValue - value);
      model.setLowerBoundary(newLower < 0 ? 0 : newLower);
    }
    buildFizzBuzz();
  });

  model.onLowerBoundaryChange((value, oldValue) => {
    if (value < 1) model.setLowerBoundary(oldValue);
    if (value > model.getUpperBoundary()){
     const newUpper = model.getUpperBoundary() + (value - oldValue);
     model.setUpperBoundary(newUpper);
    }
    buildFizzBuzz();
  });

  model.onRulesChange        (buildFizzBuzz);

  return {
    buildFizzBuzz,
    addRule,
    delRule:               model.delRule,
    onRulesChange:         model.onRulesChange,
    onResultChange:        model.onResultChange,
    getUpperBoundary:      model.getUpperBoundary,
    getLowerBoundary:      model.getLowerBoundary,
    setUpperBoundary:      model.setUpperBoundary,
    setLowerBoundary:      model.setLowerBoundary,
    onLowerBoundaryChange: model.onLowerBoundaryChange,
    onUpperBoundaryChange: model.onUpperBoundaryChange,
  }
};

const View = (controller, rootElement) => {
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
  controller.buildFizzBuzz();

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