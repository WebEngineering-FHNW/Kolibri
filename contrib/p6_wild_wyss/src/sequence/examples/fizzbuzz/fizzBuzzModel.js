import { Attribute, VALUE } from "../../../../../../docs/src/kolibri/presentationModel.js";
import { Observable }       from "../../../../../../docs/src/kolibri/observable.js";
import { nil }              from "../../sequence.js";

export { FizzBuzzModel, Rule }

/**
 * @typedef RuleType
 * @property { () => Number }                               getNr
 * @property { (nr: Number) => void }                       setNr
 * @property { () => String }                               getText
 * @property { (text: String) => void }                     setText
 * @property { (cb: ValueChangeCallback<Number> ) => void } onNrChanged
 * @property { (cb: ValueChangeCallback<String> ) => void } onTextChanged
 */

/**
 * @constructor
 * @param nr
 * @param text
 * @returns { RuleType }
 */
const Rule = (nr = 1, text = "change me") => {
  const nrAttr    = Attribute(nr);
  const textAttr  = Attribute(text);

  return {
    getNr:          nrAttr.getObs(VALUE).getValue,
    setNr:          nrAttr.getObs(VALUE).setValue,
    onNrChanged:    nrAttr.getObs(VALUE).onChange,
    getText:        textAttr.getObs(VALUE).getValue,
    setText:        textAttr.getObs(VALUE).setValue,
    onTextChanged:  textAttr.getObs(VALUE).onChange
  }
};

/**
 * @typedef FizzBuzzModelType
 *
 * @property { () => Array<RuleType> }                                      rulesSnapshot
 * @property { () => Number }                                               getLowerBoundary
 * @property { (value: Number) => void }                                    setLowerBoundary
 * @property { () => Number }                                               getUpperBoundary
 * @property { (value: Number) => void }                                    setUpperBoundary
 * @property { (nr: Number, text: String) => void }                         addRule
 * @property { (nr: Number) => void }                                       delRule
 * @property { (cb: ValueChangeCallback<SequenceType<RuleType>>) => void }  onResultChange
 * @property { (result: SequenceType<RuleType>) => void }                   setResult
 * @property { (cb: ValueChangeCallback<Array<RuleType>>) => void }         onRulesChange
 * @property { (cb: ValueChangeCallback<Number>) => void }                  onLowerBoundaryChange
 * @property { (cb: ValueChangeCallback<Number>) => void }                  onUpperBoundaryChange
 */
const FizzBuzzModel = () => {
  const rules         = Observable([]);
  const result        = Observable(nil);
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