import {TestSuite} from "./util/test.js";

import {c, Choice, fst, id, Just, Left, Nothing, Pair, Right, snd, Tuple} from "./stdlib.js";

const stdlibSuite = TestSuite("stdlib");

stdlibSuite.add("id", assert => {
    assert.is(id(1), 1);
    assert.is(id(id), id);
});

stdlibSuite.add("c (konst)", assert => {
    assert.is(c(1)(undefined), 1);
    assert.is(c(1)()         , 1);
    // test the caching
    let x = 0;
    const getX = c(x); // value of x is evaluated and cached here
    x++;
    assert.is(x, 1);
    assert.is(getX(), 0);
});

stdlibSuite.add("fst", assert => {
    assert.is(fst(1)(undefined), 1);
    assert.is(fst(1)(),          1);
});

stdlibSuite.add("snd", assert => {
    assert.is(snd(undefined)(1), 1);
    assert.is(snd()(1),          1);
});

stdlibSuite.add("tuple3", assert => {
    const [Person, firstname, lastname, age] = Tuple(3);
    const dierk = Person("Dierk")("König")(50);
    assert.is(dierk(firstname), "Dierk");
    assert.is(dierk(lastname),  "König");
    assert.is(dierk(age),       50);

});

stdlibSuite.add("pair", assert => {
    const dierk = Pair("Dierk")("König");
    assert.is(dierk(fst), "Dierk");
    assert.is(dierk(snd), "König");
});

stdlibSuite.add("either", assert => {
    const fail = _ => alert("should not reach here");
    let either = Left("some error");
    assert.is(either(id)(fail), "some error");
    either = Right("value");
    assert.is(either(fail)(id), "value");
});

stdlibSuite.add("maybe", assert => {
     const fail = _ => alert("should not reach here");
     let maybe = Nothing;
     assert.is(maybe(id)(fail), undefined);
     maybe = Just("value");
     assert.is(maybe(fail)(id), "value");
});

stdlibSuite.add("choice", assert => {

    const [Cash, CreditCard, Transfer] = Choice(3); // generalized sum type

    const pay = payment => payment                  // "pattern" match
        (() =>
             amount => 'pay ' + amount + ' cash')
        (({number, sec}) =>
             amount => 'pay ' + amount + ' with credit card ' + number + ' / ' + sec)
        (([from, to]) =>
             amount => 'pay ' + amount + ' by wire from ' + from + ' to ' + to);

    let payment = Cash();
    assert.is(pay(payment)(50), 'pay 50 cash');

    payment = CreditCard({number: '0000 1111 2222 3333', sec: '123'});
    assert.is(pay(payment)(50), 'pay 50 with credit card 0000 1111 2222 3333 / 123');

    payment = Transfer(['Account 1', 'Account 2']);
    assert.is(pay(payment)(50), 'pay 50 by wire from Account 1 to Account 2');

});


stdlibSuite.run();
