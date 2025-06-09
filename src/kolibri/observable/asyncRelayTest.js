import {AsyncRelay} from "./asyncRelay.js"
import {asyncTest}  from "../util/test.js";
import {ObservableMap} from "./observableMap.js";


asyncTest("asyncRelay set/get", assert => {

    const om  = ObservableMap("om",0);
    const rom = ObservableMap("rom",0);

    const scheduler = AsyncRelay(rom)(om);

    scheduler.addOk( _=> {
        om.setValue("a","A"); // setting the value on om should relay it to rom
    });
    scheduler.addOk( _=> {
        rom.getValue("a")
           (_=> assert.isTrue(false))
           (v=>assert.is(v,"A"));
    });

    scheduler.addOk( _=> {
        rom.setValue("a","B"); // and vice versa
    });
    scheduler.addOk( _=> {
        om.getValue("a")
           (_=> assert.isTrue(false))
           (v=>assert.is(v,"B"));
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

    scheduler.addOk( _=> {
        om.setValue("a","A");
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
            om.setValue("a","B");
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

    scheduler.addOk( _=> {
        om.setValue("a","A");
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
            rom.setValue("a", "B");
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

    om.setValue("a","A");

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

    om.setValue("a","A1"); // add
    om.setValue("a","A2"); // then change two times before async rom can update
    om.setValue("a","A3");

    assert.is(omChanges .length, 3); // om is immediately updated

    return new Promise( done => {
        scheduler.addOk( _=> {
            assert.is(romChanges.length, 3); // rom is asyncly updated
            done();
        });
    });
});

// todo: test
// om.setValue -> rom.setValue -> om.setValue (blocked due to same Value)
// om.setValue(1), omSetValue(2) -> rom.setValue -> om.setValue (cannot be blocked due to value change -> oscillation)
