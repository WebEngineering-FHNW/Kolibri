import { TestSuite } from "../../kolibri/util/test.js";
import { DayController } from "./dayController.js";

const dayControllerSuite = TestSuite("examples/workday/dayController");

dayControllerSuite.add("initial", assert => {
    const controller = DayController();
    let am_start, am_end, pm_start, pm_end;
    controller.onAmStartChanged(val => am_start = val);
    controller.onAmEndChanged  (val => am_end   = val);
    controller.onPmStartChanged(val => pm_start = val);
    controller.onPmEndChanged  (val => pm_end   = val);

    assert.is(am_start,  8 * 60);
    assert.is(am_end,   12 * 60);
    assert.is(pm_start, 13 * 60);
    assert.is(pm_end,   17 * 60);
});

dayControllerSuite.add("sequenceRule", assert => {
    const controller = DayController();
    let am_start, am_end, pm_start, pm_end;
    controller.onAmStartChanged(val => am_start = val);
    controller.onAmEndChanged  (val => am_end   = val);
    controller.onPmStartChanged(val => pm_start = val);
    controller.onPmEndChanged  (val => pm_end   = val);
    assert.is(am_start,  8 * 60);
    assert.is(am_end,   12 * 60);

    controller.setAmStart(13 * 60);      // not allowed since later than am_end.
    assert.is(am_end, 13 * 60);          // therefore, am_end is moved back to 13:00

    controller.setAmStart(18 * 60);      // move after even pm_end to see the sequence triggering through all timeslots
    assert.is(am_start, 18 * 60);        // ourselves
    assert.is(am_end,   18 * 60);        // first back mover
    assert.is(pm_start, 18 * 60 + 40);   // second back mover plus lunch break rule
    assert.is(pm_end,   18 * 60 + 40);   // third mover

    controller.setPmEnd(18 * 60);        // try the other way around, try to set pm end before pm start
    assert.is(pm_start, 18 * 60 + 40);   // the constraints hold
    assert.is(pm_end,   18 * 60 + 40);
});

dayControllerSuite.add("maxHourValidity", assert => {
    const controller = DayController();
    let am_start_valid, am_end_valid, pm_start_valid, pm_end_valid;
    controller.onAmStartValidChanged(val => am_start_valid = val);
    controller.onAmEndValidChanged  (val => am_end_valid   = val);
    controller.onPmStartValidChanged(val => pm_start_valid = val);
    controller.onPmEndValidChanged  (val => pm_end_valid   = val);
    assert.is(am_start_valid, true);
    assert.is(am_end_valid,   true);
    assert.is(pm_start_valid, true);
    assert.is(pm_end_valid,   true);

    controller.setAmStart(  4 * 60); // since we break the 12 hour rule, all are invalid
    controller.setPmEnd  ( 17 * 60 + 1); // 8:00 .. 12:00 + 13:00 .. 17:01

    assert.is(am_start_valid, false);
    assert.is(am_end_valid,   false);
    assert.is(pm_start_valid, false);
    assert.is(pm_end_valid,   false);

});

dayControllerSuite.add("getTotal", assert => {
    const controller = DayController();
    let total;
    controller.onTotalChanged(val => total = val);

    assert.is(total, 8 * 60);                   // 8:00 .. 12:00 + 13:00 .. 17:00
    assert.is(controller.getTotal(), total);

    controller.setPmEnd  ( 17 * 60 + 1);

    assert.is(total, 8 * 60 + 1);
    assert.is(controller.getTotal(), total);

});

dayControllerSuite.run();
