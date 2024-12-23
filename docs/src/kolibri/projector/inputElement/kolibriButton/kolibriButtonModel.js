import { Attribute, TYPE, EMPHASIS, DESIGNSYSTEM, STATE } from "../../../presentationModel.js";
import { TEXT_BUTTON }                                    from "../../../util/dom.js";

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
 * @typedef {'default'|'hover'|'focus'|'click'|'disabled'|'success'|'error'|'processing'} ObservableStateString
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
 * @template _T_
 * @param  { ButtonTypeString }                type
 * @param  { ObservableTypeString | string }   value
 * @param  { String? }                         qualifier
 * @param  { DesignSystemString }              style
 * @param  { EmphasisString }                  emphasis
 * @param  { ObservableStateString }           state
 * @return { AttributeType<_T_> }
 * @example
 const model = KolibriButtonModel({
      type           = TEXT_BUTTON,
      value          = 'Button Text',
      qualifier,
      designSystem   = FILLED,
      emphasis       = SECONDARY,
      state          = DEFAULT
     });
 */

const KolibriButtonModel = ({
     type           = TEXT_BUTTON,
     value          = 'Button',
     qualifier,
     designSystem   = FILLED,
     emphasis       = SECONDARY,
     state          = DEFAULT
    }) => {

    // todo dk: this should not be one attribute with n keys but just n Observables

    const singleAttribute = Attribute(value);
    if(null != qualifier) singleAttribute.setQualifier(qualifier);
    singleAttribute.getObs(TYPE)            .setValue(type);
    singleAttribute.getObs(DESIGNSYSTEM)    .setValue(designSystem);
    singleAttribute.getObs(EMPHASIS)        .setValue(emphasis);
    singleAttribute.getObs(STATE)           .setValue(state);

    return singleAttribute;

};
