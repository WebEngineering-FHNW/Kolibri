import * as _                  from "../iterator.js";
import { FizzBuzzModel, Rule } from "./fizzBuzzModel.js";

export { FizzBuzzController }


const FizzBuzzController = () => {
  const model   = FizzBuzzModel();
  const addRule = (nr, text) =>{
    const rule = Rule(nr, text);
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
