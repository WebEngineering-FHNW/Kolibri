
import {SimpleInputController}   from "../../kolibri/projector/simpleForm/simpleInputController.js";

export { DayController }

const DayController = () => {
    // value is minutes since midnight as Number
    const amStartCtrl = SimpleInputController({value: 8 * 60 ,label: "AM Start", name: "am_start", type: "time" });
    const amEndCtrl   = SimpleInputController({value:12 * 60 ,label: "AM End"  , name: "am_end"  , type: "time" });
    const pmStartCtrl = SimpleInputController({value:13 * 60 ,label: "PM Start", name: "pm_start", type: "time" });
    const pmEndCtrl   = SimpleInputController({value:17 * 60 ,label: "PM End"  , name: "pm_end"  , type: "time" });

    const am_sequence = sequenceRule(amStartCtrl,amEndCtrl);
    amStartCtrl.onValueChanged(am_sequence);
    amEndCtrl  .onValueChanged(am_sequence);
    const pm_sequence = sequenceRule(pmStartCtrl,pmEndCtrl);
    pmStartCtrl.onValueChanged(pm_sequence);
    pmEndCtrl  .onValueChanged(pm_sequence);

    const lunchBreak = lunchBreakRule(amEndCtrl, pmStartCtrl);
    amEndCtrl  .onValueChanged( lunchBreak );
    pmStartCtrl.onValueChanged( lunchBreak );

    const totalHours = totalHoursRule(amStartCtrl, amEndCtrl, pmStartCtrl, pmEndCtrl);
    amStartCtrl.onValueChanged(totalHours);
    amEndCtrl  .onValueChanged(totalHours);
    pmStartCtrl.onValueChanged(totalHours);
    pmEndCtrl  .onValueChanged(totalHours);

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
        timeController        : [amStartCtrl, amEndCtrl, pmStartCtrl, pmEndCtrl]
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
    const start_total = startInputCtrl.getValue();
    const end_total   = endInputCtrl  .getValue();

    if (start_total <= end_total) return ; // ok, we're fine
    // otherwise move the later time back
    endInputCtrl.setValue(minMaxValuesConverter(start_total));
}

const totalHoursRule = (amStartCtrl, amEndCtrl, pmStartCtrl, pmEndCtrl) => () => { // not more than 12 hours
    const am_start_total = amStartCtrl.getValue();
    const am_end_total   = amEndCtrl  .getValue();
    const pm_start_total = pmStartCtrl.getValue();
    const pm_end_total   = pmEndCtrl  .getValue();

    let isValid = am_end_total - am_start_total + pm_end_total - pm_start_total <= 12 * 60;

    [amStartCtrl, amEndCtrl, pmStartCtrl, pmEndCtrl].forEach( ctrl =>
        ctrl.setValid(isValid));
}
