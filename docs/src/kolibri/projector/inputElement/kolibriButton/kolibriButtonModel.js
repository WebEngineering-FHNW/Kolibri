import { Attribute, TYPE, EMPHASIS, DESIGNSYSTEM, STATE }   from "../../../presentationModel.js";
import { TEXTBTN }                                          from "../../../util/dom.js";

export { KolibriButtonModel }
export { DEFAULT, HOVER, FOCUS, CLICK, DISABLED, SUCCESS, ERROR, PROCESSING }
export { PRIMARY, SECONDARY, ELEVATED, FILLED, OUTLINED }

/**
 * @typedef {'primary'|'secondary'} EmphasisString
 * Feel free to extend this type with new unique type strings as needed for your application.
 */
/** @type EmphasisString */ const PRIMARY     = "primary";
/** @type EmphasisString */ const SECONDARY   = "secondary";


/**
 * @typedef {'elevated'|'filled'|'outlined'} DesignSystemString
 * Feel free to extend this type with new unique type strings as needed for your application.
 */
/** @type DesignSystemString */ const ELEVATED    = "elevated";
/** @type DesignSystemString */ const FILLED      = "filled";
/** @type DesignSystemString */ const OUTLINED    = "outlined";


/**
 * @typedef {'default'|'hover'|'focus'|'clicked'|'disabled'|'success'|'error'|'processing'} ObservableStateString
 * Feel free to extend this type with new unique type strings as needed for your application.
 */
/** @type ObservableStateString */ const DEFAULT         = "default";
/** @type ObservableStateString */ const HOVER           = "hover";
/** @type ObservableStateString */ const FOCUS           = "focus";
/** @type ObservableStateString */ const CLICK           = "click";
/** @type ObservableStateString */ const DISABLED        = "disabled";
/** @type ObservableStateString */ const SUCCESS         = "success";
/** @type ObservableStateString */ const ERROR           = "error";
/** @type ObservableStateString */ const PROCESSING      = "processing";

/**
 * Create a model for the purpose of being used to bind against a single HTML Kolibri Button.
 * For a single Button, it only needs one attribute.
 * @constructor
 * @template T
 * @param  { ButtonTypeString }                type
 * @param  { ObservableTypeString | string }   value
 * @param  { string? }                         qualifier
 * @param  { DesignSystemString }              style
 * @param  { EmphasisString }                  emphasis
 * @param  { ObservableStateString }           state
 * @return { AttributeType<T> }
 * @example
 *     const model = KolibriButtonModel({
         type:          "TEXTBTN",
         value:         "Press ME",
         qualifier:     "pressme.api.send.data"",
         designSystem:  "FILLED",
         emphasis:      "SECONDARY",
         state:         "DEFAULT"
     });
 */

const KolibriButtonModel = (
    {
     type         = TEXTBTN,
     value       = 'Button',
     qualifier,
     designSystem     = FILLED,
     emphasis= SECONDARY,
     state          = DEFAULT

    }) => {

    const singleAttribute = Attribute(value);
    if(null != qualifier) singleAttribute.setQualifier(qualifier);
    singleAttribute.getObs(TYPE)            .setValue(type);
    singleAttribute.getObs(DESIGNSYSTEM)    .setValue(designSystem);
    singleAttribute.getObs(EMPHASIS)        .setValue(emphasis);
    singleAttribute.getObs(STATE)           .setValue(state);

    return singleAttribute;

};
