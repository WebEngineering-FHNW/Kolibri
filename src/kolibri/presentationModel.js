// todo: jsdoc for exports

import { Observable } from "./observable.js";
import { id }         from "./stdlib.js";

export { Attribute, QualifiedAttribute,
         presentationModelFromAttributeNames,
         valueOf, readQualifierValue,
         VALID, VALUE, EDITABLE, LABEL }

const VALUE    = "value";
const VALID    = "valid";
const EDITABLE = "editable";
const LABEL    = "label";

/** Convenience function to read the current state of the attribute's VALUE observable for the given attribute. */
const valueOf = attribute => attribute.getObs(VALUE).getValue();

/** Creates Presentation Model with Attributes for each attribute name with VALUE and LABEL observables. */
const presentationModelFromAttributeNames = attributeNames => {
    const result = Object.create(null);
    attributeNames.forEach ( attributeName => {
        const attribute = Attribute(undefined);
        attribute.getObs(LABEL).setValue(attributeName); // default: use the attribute name as the label
        result[attributeName] = attribute;
    });
    return result;
};

const ModelWorld = () => {

    const data = {}; // key -> array of observables

    const readQualifierValue = qualifier => {
        const obss = data[qualifier + "." + VALUE];
        if (null == obss) { return undefined; }
        return obss[0].getValue(); // there are no empty arrays
    };

    const update = (getQualifier, name, observable) => {
        const qualifier = getQualifier(); // lazy get
        if (null == qualifier) { return; }
        const key = qualifier + "." + name; // example: "Person.4711.firstname" "VALID" -> "Person.4711.firstname.VALID"
        let candidates = data[key];
        if (null == candidates) {
            data[key] = [observable]; // nothing to notify
            return;
        }
        let found = false;
        candidates.forEach ( candidate => {
           if (candidate === observable) {
               found = true;
           } else {
               candidate.setValue(observable.getValue());
           }
        });
        if (! found) {
            candidates.push(observable); // lazy init: we should have been in the list
        }
    };
    const updateQualifier = (qualifier, newQualifier, observables) => {
        for (let name in observables) {
            const observable = observables[name];
            if (null != qualifier) {                    // remove qualifier from old candidates
                const oldKey = qualifier + "." + name;
                const oldCandidates = data[oldKey];
                const foundIndex = oldCandidates.indexOf(observable);
                if (foundIndex > -1) {
                    oldCandidates.splice(foundIndex, 1);
                }
                if (oldCandidates.length === 0) {       // delete empty candidates here
                    delete data[oldKey];
                }
            }
            if (null != newQualifier){                  // add to new candidates
                const newKey = newQualifier + "." + name;
                let newCandidates = data[newKey];
                if (null == newCandidates) {
                    newCandidates = data[newKey] = [];
                }
                if (newCandidates.length > 0) {         // there are existing observables that's values we need to take over
                    observable.setValue(newCandidates[0].getValue());
                }
                newCandidates.push(observable);
            }
        }
    };
    return { update, updateQualifier, readQualifierValue }
};

const modelWorld = ModelWorld(); // make a single instance, not exported, this is currently a secret

const readQualifierValue = modelWorld.readQualifierValue; // specific export

/** An Attribute that builds it's initial value from already existing qualified values
 *  instead of overriding possibly existing qualified values with the constructor value */
const QualifiedAttribute = qualifier => Attribute(readQualifierValue(qualifier), qualifier);

const Attribute = (value, qualifier) => {

    const observables = {}; // name -> observable

    const getQualifier = () => qualifier;
    const setQualifier = newQualifier => {
        const oldQualifier = qualifier;     // store for use in updateQualifier, since that needs the value to properly unregister
        qualifier = newQualifier;           // since updateQualifier sets the qualifier and calls the attribute back to read it, it must have the new value
        modelWorld.updateQualifier(oldQualifier, qualifier, observables);
    };

    const hasObs = name => observables.hasOwnProperty(name);

    const makeObservable = (name, initValue) => {
        const observable = Observable(initValue);
        observables[name] = observable;
        observable.onChange( _ => modelWorld.update(getQualifier, name, observable) );
        return observable;
    };

    const getObs = (name, initValue = null) =>
        hasObs(name)
            ? observables[name]
            : makeObservable(name, initValue);

    getObs(VALUE, value); // initialize the value at least

    let   convert           = id ;
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(getObs(VALUE).getValue());
    };
    const setConvertedValue = val => getObs(VALUE).setValue(convert(val));

    let validator        = undefined;  // the current validator in use, might change over time
    let validateListener = undefined;  // the validate listener on the attribute, lazily initialized
    const setValidator = newValidator => {
        validator = newValidator;
        if (! validateListener && validator) {
            validateListener = val => getObs(VALID).setValue(validator ? validator(val) : true);
            getObs(VALUE).onChange( validateListener );
        }
    };

    return { getObs, hasObs, setValidator, setConverter, setConvertedValue, getQualifier, setQualifier }
};
