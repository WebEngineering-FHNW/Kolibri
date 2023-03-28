import { dom }                        from "../../../../../docs/src/kolibri/util/dom.js";
import * as _                         from "../iterator.js";
import {emptyIterator}                from "../iterator.js";
import { Attribute, VALUE }           from "../../../../../docs/src/kolibri/presentationModel.js";
import { Observable, ObservableList } from "../../../../../docs/src/kolibri/observable.js";

export { Controller, View }


const Rule = (nr = 0, text = "") => {
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
  const rules   = Observable([]);
  const result  = Observable(emptyIterator);

  const addRule = rule => rules.setValue([...rules.getValue(), rule]);
  const delRule = rule => rules.setValue([...rules.getValue().filter(r => r !== rule)]);

  return {
    addRule,
    delRule,
    rulesSnapshot:  rules.getValue,
    onRulesChange:  rules.onChange,
    setResult:      result.setValue,
    onResultChange: result.onChange
  }
};

const Controller = () => {
  const model       = FizzBuzzModel();
  const addRule     = (nr, text) => model.addRule(Rule(nr,text));

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
      _.take(40),
    );

    model.setResult(fizzBuzz);
  };

  return {
    buildFizzBuzz,
    addRule,
    delRule:        model.delRule,
    onRulesChange:  model.onRulesChange,
    onResultChange: model.onResultChange
  }
};

const View = (controller, rootElement) => {
  const [addButton]     = dom(`<button>Add Rule</button>`);
  const [buildButton]   = dom(`<button>Build</button>`);
  const [rulesRoot]     = dom(`<div></div>`);
  const [resultElement] = dom(`<ol></ol>`);

  const renderRules = rules => {
    const ruleElements = rules.map(rule => ruleProjector(rule));
    rulesRoot.replaceChildren(...ruleElements);
  };

  const renderResult = result => resultElement.replaceChildren(...resultProjector(result));

  controller.onRulesChange (renderRules);
  controller.onResultChange(renderResult);
  addButton  .onclick = () => controller.addRule();
  buildButton.onclick = () => controller.buildFizzBuzz();
  rootElement.append(rulesRoot, addButton, buildButton, resultElement);
};

const resultProjector = result => [..._.map(el => dom(`<li>${el}</li>`)[0])(result)];

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
