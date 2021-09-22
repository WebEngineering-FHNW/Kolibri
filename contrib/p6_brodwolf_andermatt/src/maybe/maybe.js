import { id } from "../lambda-calculus-library/lambda-calculus.js";
export { Nothing, Just, maybe,
        maybeDiv, maybeElement, getOrDefault, getSafeElement, getSafeElements
}


const Nothing  = () => f => _ => f ();
const Just     = x  => _ => g => g (x);
const maybe    = id;

const getOrDefault = maybeFn => defaultVal => maybe(maybeFn)
                                                    (() => defaultVal)
                                                    (id)
const maybeDiv = num => divisor =>
    divisor === 0
        ? Nothing()
        : Just(num / divisor);

const maybeElement = elemId => {
    const element = document.getElementById(elemId)
    return element
        ? Just(element)
        : Nothing()
}

const getSafeElement = elemId =>
    maybe(maybeElement(elemId)
            (() => console.error(elemId + " doesnt exist") )
            (id))

const getSafeElements = (...elemIds) => elemIds.map(getSafeElement)


