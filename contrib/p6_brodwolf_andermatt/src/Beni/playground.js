//import {id, B, K, T, True, False, and, or, pair, fst, snd, Blackbird, not} from "../lambda-calculus-library/lambda-calculus.js";
const log = console.log

const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = id;

const Nothing  = () => f => g => f ();
const Just     = x  => f => g => g (x);
const maybe    = id;

// const Nothing  = Left() ;        // f is used as a value
// const Just     = Right  ;
// const maybe    = either ;     // convenience: caller does not need to repeat "konst"
// const maybe    = m => f => either (m) (fst(f)) ;

const safeDiv = num => divisor =>
    divisor === 0
        ? Nothing()
        : Just(num / divisor);

maybe(safeDiv(1)(0))
        (() => log("failed"))
        (log)




// const getElements = (...id) => id.map(e => getElement(e))

const getMaybeElement = id => {
    const element = document.getElementById(id)
    return element
        ? Just(element)
        : Nothing()
}

const getSafeElement = elementID =>
    maybe(getMaybeElement(elementID))
    (() => log(id + " gibts nit"))
    (id)

const getOrDefault = maybeEl => defaultVal => maybe(maybeEl)(() => defaultVal)(id)
const getElementOrDefault = getOrDefault(getSafeElement('label'))('')
const maybeHandler = maybeElem => handleGood => handleBad => maybe(maybeElem)(handleBad)(handleGood)




//    bindMaybe :: m a -> (a -> m b) -> mb
const bindMaybe = ma => f => maybe (ma) (ma) (f);





const safeGetElementById = element =>
    document.getElementById(element) === null
        ? console.error("element nicht verfügbar!")
        : document.getElementById(element)


const safeNum = val =>
    typeof val === "number" ? val : 0


// const mapAll = arr => (...fns) => arr.map( x => pipeAll(fns)(x) )
// const mapAll = arr => (...fns) => x =>  arr.map( fns.reduce((v, fn) => fn(v), x) )
//
// const mapLog = arr => (...fns) => arr.map( log  )

const trim = str => str.trim();
const toUpperCase = str => str.toUpperCase();

const words = ["car ", " boot", " tablet"]

const pipe = (...fns) => x => fns.reduceRight((v, fn) => fn(v), x)


const Monad = value => ({
    flatMap: f => f(value),
    map(f) {
        return this.flatMap(a => Monad(f(a)));
    }
});

// Monad.of = x => Monad(x);

// Monad(21).map(x => x * 2).map(console.log)

//


const createEvent = ({
    title: "untitled",
    date: Date.now(),
    description: ""
})

// const logs = [console.log, console.log]
const logged = x => logs.reduce((_, fn) => fn(x), x)

const execute = (...fns) => returnValue => {fns.reduce((_, fn) => fn); return returnValue}
