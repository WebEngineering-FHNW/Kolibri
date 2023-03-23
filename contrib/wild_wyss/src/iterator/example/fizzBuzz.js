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
  const values  = [];
  const rules   = ObservableList(values);
  const result  = Observable(emptyIterator);

  return {
    add:            rules.add,
    del:            rules.del,
    rulesSnapshot:  () => [...values],
    onRuleAdd:      rules.onAdd,
    onRuleDel:      rules.onDel,
    setResult:      result.setValue,
    onResultChange: result.onChange
  }
};

const Controller = () => {
  const model       = FizzBuzzModel();
  const addRule     = (nr, text) => model.add(Rule(nr,text));
  const removeRule  = rule => model.del(rule);

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
    removeRule,
    onRuleAdd:      model.onRuleAdd,
    onRuleDel:      model.onRuleDel,
    onResultChange: model.onResultChange
  }
};


const View = (controller, rootElement) => {
  const [addButton]     = dom(`<button>Add Rule</button>`);
  const [buildButton]   = dom(`<button>Build</button>`);
  const [rulesRoot]     = dom(`<div></div>`);
  const [resultElement] = dom(`<ol></ol>`);

  const render = rule => ruleProjector(rule, rulesRoot);

  resultProjector(controller, resultElement);

  controller.onRuleAdd(render);
  addButton  .onclick = () => controller.addRule();
  buildButton.onclick = () => controller.buildFizzBuzz();
  rootElement.append(rulesRoot, addButton, buildButton, resultElement);
};

const resultProjector = (controller, rootElement) => {
  controller.onResultChange(res => {
   rootElement.innerHTML = '';
   rootElement.append(..._.map(el => dom(`<li>${el}</li>`)[0])(res));
  });
};

const ruleNrProjector = (rule, rootElement) => {
  const [numberInput] = dom(`<input type="number" value="${rule.getNr()}">`);
  numberInput.oninput = () => rule.setNr(Number(numberInput.value));

  rule.onNrChanged(newValue => numberInput.value = newValue);
  rootElement.appendChild(numberInput);
};

const ruleTextProjector = (rule, rootElement)  => {
  const [textInput]  = dom(`<input value="${rule.getText()}">`);
  textInput.onchange = () => rule.setText(textInput.value);

  rule.onTextChanged(newValue => textInput.value = newValue);
  rootElement.appendChild(textInput);
};

const ruleProjector = (rule, rootElement) => {
  const container = document.createElement("DIV");

  ruleNrProjector  (rule, container);
  ruleTextProjector(rule, container);

  rootElement.appendChild(container);
};
