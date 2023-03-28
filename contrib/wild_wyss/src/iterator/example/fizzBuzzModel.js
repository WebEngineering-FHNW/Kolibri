import { Attribute, VALUE } from "../../../../../docs/src/kolibri/presentationModel.js";
import { Observable }       from "../../../../../docs/src/kolibri/observable.js";
import { emptyIterator }    from "../constructors.js";

export { FizzBuzzModel, Rule }

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

