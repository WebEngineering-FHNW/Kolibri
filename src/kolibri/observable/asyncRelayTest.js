import {AsyncRelay} from "./asyncRelay.js"
import {asyncTest}  from "../util/test.js";
import {ObservableMap} from "./observableMap.js";
import {Scheduler} from "../dataflow/dataflow.js";


asyncTest("asyncRelay set/get", assert => {

    const om  = ObservableMap("om",0);
    const rom = ObservableMap("rom",0);

    const scheduler = AsyncRelay(rom)(om);

    const valueA = Object("A");
    const valueB = Object("B");

    scheduler.addOk( _=> {
        om.setValue("a",valueA); // setting the value on om should relay it to rom
    });
    scheduler.addOk( _=> {
        rom.getValue("a")
           (_=> assert.isTrue(false))
           (v=>assert.is(v,valueA));
    });

    scheduler.addOk( _=> {
        rom.setValue("a",valueB); // and vice versa
    });
    scheduler.addOk( _=> {
        om.getValue("a")
           (_=> assert.isTrue(false))
           (v=>assert.is(v,valueB));
    });

    return new Promise( done => {
        scheduler.addOk( _ => done());
    });

});

asyncTest("asyncRelay onChange om", assert => {

    const om  = ObservableMap("om",0);
    const rom = ObservableMap("rom",0);

    const omChanges = [];
    const romChanges = [];

    assert.iterableEq(omChanges, romChanges);

    const scheduler = AsyncRelay(rom)(om);

    om.onChange( (key, value) => omChanges.push(`${key} ${value}`));

    const valueA = Object("A");
    const valueB = Object("B");

    scheduler.addOk( _=> {
        om.setValue("a",valueA);
    });
    scheduler.addOk( _=> {
        // we add the listener late, such that the first update
        // has already gone through. Still, everything has to be in sync.
        rom.onChange( (key, value) => romChanges.push(`${key} ${value}`));
    });
    scheduler.addOk( _=> {
        assert.iterableEq(omChanges, romChanges);
    });

    return new Promise( done => {
        // change value through om
        scheduler.addOk( _=> {
            om.setValue("a", valueB);
            scheduler.addOk( _=> {
                    assert.iterableEq(omChanges, romChanges);
                    done();
                });
        });
    });

});
asyncTest("asyncRelay onChange rom", assert => {

    const om  = ObservableMap("om",0);
    const rom = ObservableMap("rom",0);

    const omChanges = [];
    const romChanges = [];

    assert.iterableEq(omChanges, romChanges);

    const scheduler = AsyncRelay(rom)(om);

    om.onChange( (key, value) => omChanges.push(`${key} ${value}`));

    const valueA = Object("A");
    const valueB = Object("B");

    scheduler.addOk( _=> {
        om.setValue("a",valueA);
    });
    scheduler.addOk( _=> {
        // we add the listener late, such that the first update
        // has already gone through. Still, everything has to be in sync.
        rom.onChange( (key, value) => romChanges.push(`${key} ${value}`));
    });
    scheduler.addOk( _=> {
        assert.iterableEq(omChanges, romChanges);
    });

    return new Promise( done => {    // change value through rom
        scheduler.addOk(_ => {
            rom.setValue("a", valueB);
            scheduler.addOk(_ => {
                assert.iterableEq(omChanges, romChanges);
                done();
            });

        });
    });

});

asyncTest("asyncRelay om set value once", assert => {

    const om  = ObservableMap("om",0);
    const rom = ObservableMap("rom",0);

    const omChanges = [];
    const romChanges = [];

    const scheduler = AsyncRelay(rom)(om);

    om .onChange( (key, value) => omChanges .push(`${key} ${value}`));
    rom.onChange( (key, value) => romChanges.push(`${key} ${value}`));

    assert.is(omChanges .length, 0);
    assert.is(romChanges.length, 0);

    om.setValue("a",Object("A"));

    return new Promise( done => {
        scheduler.addOk( _=> {
            assert.is(omChanges .length, 1);
            assert.is(romChanges.length, 1);
            done();
        });
    });
});

asyncTest("asyncRelay om set value three times from same work package", assert => {

    const om  = ObservableMap("om" , 0);
    const rom = ObservableMap("rom", 0);

    const omChanges  = [];
    const romChanges = [];

    const scheduler = AsyncRelay(rom)(om);

    om .onChange( (key, value) => omChanges .push(`${key} ${value}`));
    rom.onChange( (key, value) => romChanges.push(`${key} ${value}`));

    assert.is(omChanges .length, 0);
    assert.is(romChanges.length, 0);

    om.setValue("a",Object("A1")); // add
    om.setValue("a",Object("A2")); // then change two times before async rom can update
    om.setValue("a",Object("A3"));

    assert.is(omChanges .length, 3); // om is immediately updated

    return new Promise( done => {
        scheduler.addOk( _=> {
            assert.is(romChanges.length, 3); // rom is asyncly updated
            done();
        });
    });
});


asyncTest("asyncRelay om1 - rom - om2", assert => {

    const om1 = ObservableMap("om1", 0);
    const om2 = ObservableMap("om2", 0);
    const rom = ObservableMap("rom", 0);

    const om1Changes = [];
    const om2Changes = [];
    const romChanges = [];

    // This scenario works fine when all access to the OMs is sequenced through
    // an overarching scheduler

    const testScheduler = Scheduler();
    AsyncRelay(rom)(om1);
    AsyncRelay(rom)(om2);

    om1.onChange( (key, value) => om1Changes.push(`${key} ${value}`));
    om2.onChange( (key, value) => om2Changes.push(`${key} ${value}`));
    rom.onChange( (key, value) => romChanges.push(`${key} ${value}`));

    testScheduler.addOk( _ => {
        om1.setValue("a",Object("A1")); // add
        assert.is(om1Changes .length, 1);
    });
    testScheduler.addOk( _ => {           // note: this doesn't need scheduler1 because we are added after the s1 tasks
        assert.is(romChanges.length, 1); // rom was asyncly updated
        assert.is(om2Changes.length, 1); // and so was om2
    });

    testScheduler.addOk( _ => {
        om1.setValue("a",Object("A2")); // change value
        assert.is(om1Changes .length, 2);
    });
    testScheduler.addOk( _ => {
        assert.is(romChanges.length, 2);
        assert.is(om2Changes.length, 2);
    });

    testScheduler.addOk( _ => {
        om2.setValue("a",Object("A3"));     // now change through om2
        assert.is(om2Changes .length, 3);
    });
    testScheduler.addOk( _ => {
        assert.is(romChanges.length, 3);
        assert.is(om2Changes.length, 3);
    });

    return new Promise( done => { // both schedulers must be done
        testScheduler.addOk( _=> {
           done();
        });
    });
});
