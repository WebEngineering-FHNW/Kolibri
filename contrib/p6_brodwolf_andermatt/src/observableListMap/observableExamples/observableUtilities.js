export {getElement, getElements, onInputListener, onInputListeners, toHexString, toRGBString}
import { setValue } from "../observableListMap.js";

const getElement = id => document.getElementById(id); // maybe impl for safety
const getElements = (...id) => id.map(e => getElement(e))

const onInputListener = (observable, input) => input.oninput = _ => observable = observable(setValue)(input.value) // maybe impl for safety
const onInputListeners = (observable, ...inputs) => inputs.map(input => onInputListener(observable, input))

const toRGBString = (r, g, b) => 'rgb(' + r + ',' + g + ',' + b + ')'
const toHexString = (r, g, b) => "#" + toHex(r) + toHex(g) + toHex(b)
const toHex = n => {
    if (n === undefined) n = 0
    let hex = Math.round(n).toString(16)
    return hex.length === 1 ? "0" + hex : hex
}
