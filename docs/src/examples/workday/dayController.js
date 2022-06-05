/**
 * @module examples/workday/dayController
 * API and business rules for a workday, manages morning and afternoon working hours with constraints.
 */


import { SimpleInputController } from "../../kolibri/projector/simpleForm/simpleInputController.js";
import { Attribute, VALUE }      from "../../kolibri/presentationModel.js";

export { DayController }

/**
 * @typedef DayModelType
 * @property { AttributeType<Number> } total -the total working minutes for this day
 */

/**
 * A presentation model for a work day that captures all information that the controller needs on top of
 * what he can delegate to other controllers. In this case there is only the total number of minutes that
 * derives from the start-end times.
 * Using an extra presentation model to only capture one attribute is a bit over-engineered. We do it anyway
 * to show the canonical structure of controllers that encapsulate a presentation model.
 * @private
 * @pure
 * @return { DayModelType }
 * @constructor
 */
const DayModel = () => {
    const total = Attribute(0); // total minutes in this day
    return /** @type {DayModelType} */ { total };
};

/**
 * @typedef DayControllerType
 * @property { SimpleInputControllerType<Number> }  amStartCtrl
 * @property { SimpleInputControllerType<Number> }  amEndCtrl
 * @property { SimpleInputControllerType<Number> }  pmStartCtrl
 * @property { SimpleInputControllerType<Number> }  pmEndCtrl
 * @property { () => Number }                       getTotal        - the total minutes in this day, derived
 * @property { (callback: !onValueChangeCallback<Number>) => void } onTotalChanged - when total changes
 */
/**
 * Creating a day controller made from four simple input controllers for the four time values (as numbers
 * meaning minutes since midnight).
 * The DayController enforces the business rules of min-max values, the earliest start, the latest end,
 * sequence, lunch breaks, and total time.
 * The rules for earliest start and latest end are left to the projector. This is questionable, but we do it
 * anyway just to show that sometimes the view already enforces constraints.
 * @pure
 * @return { DayControllerType }
 * @constructor
 */
const DayController = () => {
    // value is minutes since midnight as Number
    /** @type {SimpleInputControllerType<Number>} */ const amStartCtrl = SimpleInputController({value: 8 * 60 ,label: "AM Start", name: "am_start", type: "time" });
    /** @type {SimpleInputControllerType<Number>} */ const amEndCtrl   = SimpleInputController({value:12 * 60 ,label: "AM End"  , name: "am_end"  , type: "time" });
    /** @type {SimpleInputControllerType<Number>} */ const pmStartCtrl = SimpleInputController({value:13 * 60 ,label: "PM Start", name: "pm_start", type: "time" });
    /** @type {SimpleInputControllerType<Number>} */ const pmEndCtrl   = SimpleInputController({value:17 * 60 ,label: "PM End"  , name: "pm_end"  , type: "time" });

    const timeControllers = [amStartCtrl, amEndCtrl, pmStartCtrl, pmEndCtrl];

    timeControllers.forEach(ctrl => ctrl.setConverter(minMaxValuesConverter));

    const { total }    = DayModel();

    const am_sequence = sequenceRule(amStartCtrl,amEndCtrl);
    amStartCtrl.onValueChanged(am_sequence);
    amEndCtrl  .onValueChanged(am_sequence);
    const pm_sequence = sequenceRule(pmStartCtrl,pmEndCtrl);
    pmStartCtrl.onValueChanged(pm_sequence);
    pmEndCtrl  .onValueChanged(pm_sequence);

    const lunchBreak = lunchBreakRule(amEndCtrl, pmStartCtrl);
    amEndCtrl  .onValueChanged( lunchBreak );
    pmStartCtrl.onValueChanged( lunchBreak );

    // whenever any time value changes, we have to update the total,
    // and we have to check for possible changes in validity
    timeControllers.forEach( ctrl =>
         ctrl.onValueChanged( _ => {
             total.getObs(VALUE).setValue(totalValue(timeControllers)); // update total
             checkValidityRules(timeControllers);
         })
     );

    return /** @type DayControllerType*/ {
        amStartCtrl ,
        amEndCtrl   ,
        pmStartCtrl ,
        pmEndCtrl   ,
        onTotalChanged: total.getObs(VALUE).onChange,
        getTotal      : total.getObs(VALUE).getValue,
    }
};

/**
 * Convert numbers to valid minutes after midnight
 * @pure
 * @private
 * @param  { Number } minutes
 * @return { Number } - value between 0 and 24 * 60
 */
const minMaxValuesConverter = minutes => Math.max( 0, (Math.min(minutes, 24 * 60)));

/**
 * The lunch break must be at least 40 minutes. Otherwise, we set the end of the lunch break back, which might
 * trigger further value changes (e.g. because of the {@link sequenceRule}).
 * @private
 * @impure - might change the pm start value
 * @param  {SimpleInputControllerType<Number>} amEndCtrl
 * @param  {SimpleInputControllerType<Number>} pmStartCtrl
 * @return { () => void } - the lunch break rule handler as a side-effecting function
 */
const lunchBreakRule = (amEndCtrl, pmStartCtrl) => () => { // 40 min lunch break
    const amEndTime   = amEndCtrl  .getValue();
    const pmStartTime = pmStartCtrl.getValue();

    if (pmStartTime - amEndTime < 40) {       // lunchtime too short
        pmStartCtrl.setValue(amEndTime + 40); // make it last longer
    }
};

/**
 * For any start and end value, the start must be no later than the end value.
 * If violated, we move the end value back.
 * @private
 * @impure - might change the value of the end input
 * @param  {SimpleInputControllerType<Number>} startInputCtrl
 * @param  {SimpleInputControllerType<Number>} endInputCtrl
 * @return { () => void } - the sequence rule handler as a side-effecting function
 */
const sequenceRule = (startInputCtrl, endInputCtrl) => () => { // start must be <= end
    const start_val = startInputCtrl.getValue();
    const end_val   = endInputCtrl  .getValue();

    if (start_val > end_val) {            // start after end not allowed
        endInputCtrl.setValue(start_val); // move the end time back
    }
};

/**
 * Convenience function to check all validation constraints in order of precedence.
 * If there were only isolated validation rules per input, we could use an isolated validator per input, but
 * here we have single validation rules combined with cross-input validation rules.
 * This requires a centralized handling (see test case "trickyValidity").
 * It is easy to get this wrong and overlooked when testing manually.
 * @private
 * @impure  - might change the validity of any input
 * @param   {SimpleInputControllerType<Number>[]} timeControllers
 * @return  void
 */
const checkValidityRules = timeControllers => {
    // first we check whether we exceed 12 h in which case _all_ inputs become invalid, and we are done.
    if ( totalValue(timeControllers) > 12 * 60 ) {
        timeControllers.forEach( ctrl => ctrl.setValid(false));
        return;
    }
    // only if we are < 12 h, we check the individual valid constraints
    timeControllers.forEach( ctrl =>
        ctrl.setValid(ctrl.getValue() >=  4 * 60
                   && ctrl.getValue() <= 22 * 60)
    );
};

/**
 * Calculate the total number of minutes worked this day, given the inputs.
 * @param {SimpleInputControllerType<Number>[]} timeControllers
 * @return { Number }
 */
const totalValue = timeControllers => {
    const [am_start_val, am_end_val, pm_start_val, pm_end_val] = timeControllers.map( ctrl => ctrl.getValue());
    return am_end_val - am_start_val + pm_end_val - pm_start_val;
};
