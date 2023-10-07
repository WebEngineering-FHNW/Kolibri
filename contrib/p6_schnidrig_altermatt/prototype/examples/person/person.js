import {Attribute, EDITABLE, LABEL, TYPE, VALUE, VALID } from "../../kolibri/presentationModel.js";

export { Person, reset, ALL_ATTRIBUTE_NAMES, selectionMold }

/**
 * Names of those attributes of a Person that are to appear on the UI.
 * @type { String[] }
 */
const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname'];

/**
 * Internal, mutable, singleton state to make Person qualifiers unique.
 * @private
 */
let idCounter = 0;

/**
 * @typedef  PersonType
 * @property { Attribute<String>}  firstname
 * @property { Attribute<String>}  lastname
 * @property { Attribute<Boolean>} detailed - whether this Person instance should be visible in a detail view
 * @property { () => String }      toString
 */

/**
 * Constructs a new Person instance with default values and sets up all necessary observables.
 * There is a converter for the lastname to uppercase (just to show how such a thing is done), and
 * there is a validator for the lastname to make sure it has at least 3 characters.
 * @return { PersonType }
 * @constructor
 */
const Person = () => {                               // facade
    const id = idCounter++;
    /** @type AttributeType<String> */
    const firstnameAttr = Attribute("John", `Person.${id}.firstname`);
    firstnameAttr.getObs(LABEL)     .setValue("First Name");
    firstnameAttr.getObs(TYPE)      .setValue("text");
    firstnameAttr.getObs(EDITABLE)  .setValue(true);
    firstnameAttr.getObs(VALID)     .setValue(true);

    /** @type AttributeType<String> */
    const lastnameAttr  = Attribute("Doe", `Person.${id}.lastname`);
    lastnameAttr.getObs(LABEL)      .setValue("Last Name");
    lastnameAttr.getObs(TYPE)       .setValue("text");
    lastnameAttr.getObs(EDITABLE)   .setValue(true);
    lastnameAttr.getObs(VALID)      .setValue(true);

    /** @type AttributeType<Boolean> */
    const detailedAttr  = Attribute(true, `Person.${id}.detailed`);

    lastnameAttr.setConverter( input => input.toUpperCase() );  // enable for playing around
    lastnameAttr.setValidator( input => input.length >= 3   );

    return /** @type PersonType */ {
        firstname:  firstnameAttr,
        lastname:   lastnameAttr,
        detailed:   detailedAttr,
        toString: () => firstnameAttr.getObs(VALUE).getValue() + " " + lastnameAttr.getObs(VALUE).getValue(),
    }
};

/**
 * Remove the default values of a person.
 */
const reset = person => {
    ALL_ATTRIBUTE_NAMES.forEach( name => {
        person[name].setQualifier(undefined);
        person[name].setConvertedValue("");
    });
    return person;
};

/**
 * Fixed, singleton, extra person model instance that represents the current selection.
 * Rather than storing a reference to the selected person model, we let the attribute values
 * (observable values for each attribute plus possible qualifiers)
 * of the selected person "flow" into this "mold".
 * Multi-way editing is achieved via automated qualifier synchronization.
 * Some frameworks call this a "proxy".
 */
const selectionMold = reset(Person()); // make a new empty Person model to start with
