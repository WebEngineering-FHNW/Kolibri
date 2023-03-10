import {TestSuite} from "../util/test.js"
import {Choice, fst, Pair, snd, Tuple} from "./rock.js";

const rock = TestSuite("rock");

rock.add("border", assert => {

     try {
         Tuple(-1);
         assert.isTrue(false); // must not reach here
     } catch (expected) {
         assert.isTrue(true);
     }

     try {
         Tuple(0);
         assert.isTrue(false); // must not reach here
     } catch (expected) {
         assert.isTrue(true);
     }
});

rock.add("pair", assert => {

     const dierk = Pair("Dierk")("König");
     const firstname = fst;
     const lastname  = snd;

     assert.is(dierk(firstname), "Dierk");
     assert.is(dierk(lastname),  "König");

});

rock.add("tuple3", assert => {

     const [Person, firstname, lastname, age] = Tuple(3);

     const dierk = Person("Dierk")("König")(50);

     assert.is(dierk(firstname), "Dierk");
     assert.is(dierk(lastname),  "König");
     assert.is(dierk(age),       50);

});

rock.add("choice", assert => {

    const [Cash, CreditCard, Transfer, match] = Choice(3); // generalized sum type

    const pay = payment => match(payment)                  // "pattern" match
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

rock.run();
