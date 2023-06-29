import { FizzBuzzModel, Rule } from "./fizzBuzzModel.js";
import * as _                  from "../../sequence.js";

export { FizzBuzzController }

/**
 *
 * @typedef FizzBuzzControllerType
 * @property { () => Number }                                               getLowerBoundary
 * @property { (value: Number) => void }                                    setLowerBoundary
 * @property { () => Number }                                               getUpperBoundary
 * @property { (value: Number) => void }                                    setUpperBoundary
 * @property { (nr: Number = 0, text: String = "") => void }                addRule
 * @property { (nr: Number) => void }                                       delRule
 * @property { (cb: ValueChangeCallback<SequenceType<RuleType>>) => void }  onResultChange
 * @property { (cb: ValueChangeCallback<Array<RuleType>>) => void }         onRulesChange
 * @property { (cb: ValueChangeCallback<Number>) => void }                  onLowerBoundaryChange
 * @property { (cb: ValueChangeCallback<Number>) => void }                  onUpperBoundaryChange
 */

/**
 *
 * @returns { FizzBuzzControllerType }
 * @constructor
 */
const FizzBuzzController = () => {
  const model   = FizzBuzzModel();
  const addRule = (nr, text) =>{
    const rule = Rule(nr, text);
    rule.onTextChanged(buildFizzBuzz);
    rule.onNrChanged(buildFizzBuzz);
    model.addRule(rule);
  };

  const infiniteNumbers = _.Sequence(1, _ => true, i => i + 1);

  const createSequenceForRule = rule =>
    _.pipe(
      _.map(a => a === rule.getNr() ? rule.getText() : ""), // add rule's text to number
      _.take(rule.getNr()), // abort on this rules number
      _.cycle
    )(infiniteNumbers);

  const buildFizzBuzz = () => {
    const currentRules = model.rulesSnapshot().map(createSequenceForRule);

    const baseLine  = _.Sequence("", _ => true, _ => "");
    const fizzBuzz  = _.pipe(
      _.reduce$((acc, cur) => // reduce to single iterable by combining all iterable values
        _.zipWith((a, b) => a + b)(acc)(cur), // combine all strings
        baseLine), // start value (empty strings)

      _.zipWith((numbers, pattern) => pattern === "" ? String(numbers) : pattern)(infiniteNumbers), // add numbers where no text is present

      // limit output
      _.take(model.getUpperBoundary()),
      _.drop(model.getLowerBoundary() -1),
    )(currentRules);

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