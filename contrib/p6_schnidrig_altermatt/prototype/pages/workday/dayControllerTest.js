// noinspection DuplicatedCode

import { TestSuite }     from "../../kolibri/util/test.js";
import { DayController } from "./dayController.js";

const dayControllerSuite = TestSuite("examples/workday/dayController");

dayControllerSuite.add("initial", assert => {
    const dayCtrl = DayController();
    let am_start, am_end, pm_start, pm_end;
    dayCtrl.amStartCtrl.onValueChanged(val => am_start = val);
    dayCtrl.amEndCtrl  .onValueChanged(val => am_end   = val);
    dayCtrl.pmStartCtrl.onValueChanged(val => pm_start = val);
    dayCtrl.pmEndCtrl  .onValueChanged(val => pm_end   = val);

    assert.is(am_start,  8 * 60);
    assert.is(am_end,   12 * 60);
    assert.is(pm_start, 13 * 60);
    assert.is(pm_end,   17 * 60);
});

dayControllerSuite.add("sequenceRule", assert => {
    const dayCtrl = DayController();
    let am_start, am_end, pm_start, pm_end;
    dayCtrl.amStartCtrl.onValueChanged(val => am_start = val);
    dayCtrl.amEndCtrl  .onValueChanged(val => am_end   = val);
    dayCtrl.pmStartCtrl.onValueChanged(val => pm_start = val);
    dayCtrl.pmEndCtrl  .onValueChanged(val => pm_end   = val);
    assert.is(am_start,  8 * 60);
    assert.is(am_end,   12 * 60);

    dayCtrl.amStartCtrl.setValue(13 * 60);      // not allowed since later than am_end.
    assert.is(am_end, 13 * 60);          // therefore, am_end is moved back to 13:00

    dayCtrl.amStartCtrl.setValue(18 * 60);      // move after even pm_end to see the sequence triggering through all timeslots
    assert.is(am_start, 18 * 60);        // ourselves
    assert.is(am_end,   18 * 60);        // first back mover
    assert.is(pm_start, 18 * 60 + 40);   // second back mover plus lunch break rule
    assert.is(pm_end,   18 * 60 + 40);   // third mover

    dayCtrl.pmEndCtrl.setValue(18 * 60);        // try the other way around, try to set pm end before pm start
    assert.is(pm_start, 18 * 60 + 40);   // the constraints hold
    assert.is(pm_end,   18 * 60 + 40);
});

dayControllerSuite.add("maxHourValidity", assert => {
    const dayCtrl = DayController();
    let am_start_valid, am_end_valid, pm_start_valid, pm_end_valid;
    dayCtrl.amStartCtrl.onValidChanged(val => am_start_valid = val);
    dayCtrl.amEndCtrl  .onValidChanged(val => am_end_valid   = val);
    dayCtrl.pmStartCtrl.onValidChanged(val => pm_start_valid = val);
    dayCtrl.pmEndCtrl  .onValidChanged(val => pm_end_valid   = val);
    assert.is(am_start_valid, true);
    assert.is(am_end_valid,   true);
    assert.is(pm_start_valid, true);
    assert.is(pm_end_valid,   true);

    dayCtrl.amStartCtrl.setValue(  4 * 60); // since we break the 12-hour rule, all are invalid
    dayCtrl.pmEndCtrl  .setValue( 17 * 60 + 1); // 8:00 .. 12:00 + 13:00 .. 17:01

    assert.is(am_start_valid, false);
    assert.is(am_end_valid,   false);
    assert.is(pm_start_valid, false);
    assert.is(pm_end_valid,   false);
});

// validity can be tricky when part of the rules apply to isolated attributes but
// there are overlapping cross-attribute constraints at the same time
dayControllerSuite.add("trickyValidity", assert => {
    const dayCtrl = DayController();
    let am_start_valid, am_end_valid, pm_start_valid, pm_end_valid;
    dayCtrl.amStartCtrl.onValidChanged(val => am_start_valid = val);
    dayCtrl.amEndCtrl  .onValidChanged(val => am_end_valid   = val);
    dayCtrl.pmStartCtrl.onValidChanged(val => pm_start_valid = val);
    dayCtrl.pmEndCtrl  .onValidChanged(val => pm_end_valid   = val);
    assert.is(am_start_valid, true);
    assert.is(am_end_valid,   true);
    assert.is(pm_start_valid, true);
    assert.is(pm_end_valid,   true);

    // we only invalidate am start but let the total hours true
    dayCtrl.amStartCtrl.setValue(  4 * 60 - 1); // am start is outside the valid range
    dayCtrl.pmEndCtrl  .setValue( 13 * 60 - 1); // total hours is still fine

    assert.is(am_start_valid, false);
    assert.is(am_end_valid,   true);
    assert.is(pm_start_valid, true);
    assert.is(pm_end_valid,   true);

    // now we break the total hours rule
    dayCtrl.pmEndCtrl  .setValue( 17 * 60 );
    assert.is(am_start_valid, false);
    assert.is(am_end_valid,   false);
    assert.is(pm_start_valid, false);
    assert.is(pm_end_valid,   false);

    // now we make the total hours valid again, which must _not_ unset the false validity of am start
    dayCtrl.pmEndCtrl  .setValue( 13 * 60 - 1);
    assert.is(am_start_valid, false);
    assert.is(am_end_valid,   true);
    assert.is(pm_start_valid, true);
    assert.is(pm_end_valid,   true);

});

dayControllerSuite.add("minMaxRule", assert => {
    const dayCtrl = DayController();

    dayCtrl.amStartCtrl.setValue(-1);
    assert.is(dayCtrl.amStartCtrl.getValue(), 0);

    dayCtrl.amStartCtrl.setValue(24 * 60 + 1);
    assert.is(dayCtrl.amStartCtrl.getValue(), 24 * 60 );
});

dayControllerSuite.add("earliest", assert => {
    const dayCtrl = DayController();
    let valid = false;
    dayCtrl.amStartCtrl.onValidChanged( val => valid = val);

    assert.is(valid, true); // start value is true

    dayCtrl.amStartCtrl.setValue(4 * 60 - 1);
    assert.is(valid, false); // too early

    dayCtrl.amStartCtrl.setValue(24 * 60 + 1);
    assert.is(dayCtrl.amStartCtrl.getValue(), 24 * 60 );
});

dayControllerSuite.add("getTotal", assert => {
    const dayCtrl = DayController();
    let total;
    dayCtrl.onTotalChanged(val => total = val);

    assert.is(total, 8 * 60);                   // 8:00 .. 12:00 + 13:00 .. 17:00
    assert.is(dayCtrl.getTotal(), total);

    dayCtrl.pmEndCtrl.setValue( 17 * 60 + 1);

    assert.is(total, 8 * 60 + 1);
    assert.is(dayCtrl.getTotal(), total);

});

dayControllerSuite.run();
