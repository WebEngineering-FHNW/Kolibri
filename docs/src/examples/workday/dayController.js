
import { SimpleInputController } from "../../kolibri/projector/simpleForm/simpleInputController.js";
import { Attribute, VALUE }      from "../../kolibri/presentationModel.js";

export { DayController }

const DayModel = () => {
    const total = Attribute(0); // total minutes in this day
    return { total };
};

const DayController = () => {
    // value is minutes since midnight as Number
    const amStartCtrl = SimpleInputController({value: 8 * 60 ,label: "AM Start", name: "am_start", type: "time" });
    const amEndCtrl   = SimpleInputController({value:12 * 60 ,label: "AM End"  , name: "am_end"  , type: "time" });
    const pmStartCtrl = SimpleInputController({value:13 * 60 ,label: "PM Start", name: "pm_start", type: "time" });
    const pmEndCtrl   = SimpleInputController({value:17 * 60 ,label: "PM End"  , name: "pm_end"  , type: "time" });
    const timeControllers = [amStartCtrl, amEndCtrl, pmStartCtrl, pmEndCtrl];

    const { total }    = DayModel(0);

    const am_sequence = sequenceRule(amStartCtrl,amEndCtrl);
    amStartCtrl.onValueChanged(am_sequence);
    amEndCtrl  .onValueChanged(am_sequence);
    const pm_sequence = sequenceRule(pmStartCtrl,pmEndCtrl);
    pmStartCtrl.onValueChanged(pm_sequence);
    pmEndCtrl  .onValueChanged(pm_sequence);

    const lunchBreak = lunchBreakRule(amEndCtrl, pmStartCtrl);
    amEndCtrl  .onValueChanged( lunchBreak );
    pmStartCtrl.onValueChanged( lunchBreak );

    // whenever any time value changes, we have to update the total
    const updateTotal = () => total.getObs(VALUE).setValue(totalValue(timeControllers));
    timeControllers.forEach( ctrl =>
        ctrl.onValueChanged(updateTotal)
    );

    // whenever the total changes, we have to check the totalHoursRule
    total.getObs(VALUE).onChange(totalHoursRule(timeControllers) );

    return {
        setAmStart            : val => amStartCtrl.setValue(minMaxValuesConverter(val)),
        setAmEnd              : val => amEndCtrl  .setValue(minMaxValuesConverter(val)),
        setPmStart            : val => pmStartCtrl.setValue(minMaxValuesConverter(val)),
        setPmEnd              : val => pmEndCtrl  .setValue(minMaxValuesConverter(val)),
        onAmStartChanged      : amStartCtrl.onValueChanged,
        onAmEndChanged        : amEndCtrl  .onValueChanged,
        onPmStartChanged      : pmStartCtrl.onValueChanged,
        onPmEndChanged        : pmEndCtrl  .onValueChanged,
        onAmStartValidChanged : amStartCtrl.onValidChanged,
        onAmEndValidChanged   : amEndCtrl  .onValidChanged,
        onPmStartValidChanged : pmStartCtrl.onValidChanged,
        onPmEndValidChanged   : pmEndCtrl  .onValidChanged,
        onTotalChanged        : total  .getObs(VALUE).onChange,
        getTotal              : total  .getObs(VALUE).getValue,
        timeController        : timeControllers
    }
};

const minMaxValuesConverter = mins => Math.max( 0, (Math.min(mins, 24 * 60)));

const lunchBreakRule = (amEndCtrl, pmStartCtrl) => () => { // 40 min lunch break
    const amEndTime   = amEndCtrl  .getValue();
    const pmStartTime = pmStartCtrl.getValue();

    if (pmStartTime - amEndTime >= 40) return; // it's all fine, nothing to do
    // otherwise move the pmStartTime back
    pmStartCtrl.setValue(minMaxValuesConverter(amEndTime + 40));    // Note: no more need to fire an event!
}

const sequenceRule = (startInputCtrl, endInputCtrl) => () => { // start must be <= end
    const start_val = startInputCtrl.getValue();
    const end_val   = endInputCtrl  .getValue();

    if (start_val <= end_val) return ; // ok, we're fine
    // otherwise move the later time back
    endInputCtrl.setValue(minMaxValuesConverter(start_val));
}

const totalHoursRule = (timeControllers) => () => { // not more than 12 hours
    const isValid = totalValue(timeControllers) <= 12 * 60;
    timeControllers.forEach( ctrl =>
        ctrl.setValid(isValid));
}

const totalValue = timeControllers => {
    const [am_start_val, am_end_val, pm_start_val, pm_end_val] = timeControllers.map( ctrl => ctrl.getValue());
    return am_end_val - am_start_val + pm_end_val - pm_start_val;
}
