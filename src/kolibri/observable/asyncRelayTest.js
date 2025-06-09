import {AsyncRelay} from "./asyncRelay.js"
import {asyncTest}  from "../util/test.js";
import {ObservableMap} from "./observableMap.js";


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
