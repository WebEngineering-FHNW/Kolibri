import {ObservableList} from "./observableList.js";
import {TestSuite}      from "../util/test.js";

const suite = TestSuite("observable");

suite.add("list", assert => {
    const raw  = [];
    const list = ObservableList( raw ); // decorator pattern

    assert.is(list.count(), 0);
    let addCount = 0;
    let delCount = 0;
    list.onAdd( item => addCount += item);
    list.add(1);
    assert.is(addCount, 1);
    assert.is(list.count(), 1);
    assert.is(list.countIf( item => 1 === item), 1);
    assert.is(list.countIf( item => 0 === item), 0);
    assert.is(raw.length, 1);

    list.onDel( item => delCount += item);
    list.del(1);
    assert.is(delCount, 1);
    assert.is(list.count(), 0);
    assert.is(list.countIf( _ => true), 0);
    assert.is(raw.length, 0);

});

suite.run();
