import {getDomElement} from "../../maybe/maybe.js";
import {addListener, getValue, removeListener, setValue} from "../observable.js";
export {toHexString, toRGBString, creatHtmlUnsubscribeToggle, addUnSubscriberToggle, generateRandomKey, speak}


/**
 * Generate a random string with the length of six (by default) with numbers and letters (random up- & lowercase)
 * @param  {number} length (optional, default = 6)
 * @return {string} random string
 */
const generateRandomKey = (length = 6) => Math.random().toString(36).substr(2, length).split('').map(s => Math.round(Math.random()) ? s.toUpperCase() : s.toLowerCase()).join('');

/**
 * Text-To-Speech Function
 * If an Text is currently being spoken, speaking will stop immediately and start the new one.
 * @param {string} txt
 */
const speak = txt => {
    if (speechSynthesis.speaking){  speechSynthesis.cancel()  }
    const msg = new SpeechSynthesisUtterance(txt);
    msg.lang = "en-US";
    msg.volume = 1; // From 0   to 1    (1)
    msg.rate = 1;   // From 0.1 to 10   (1)
    msg.pitch = 1;  // From 0   to 2    (1)
    speechSynthesis.speak(msg);
}

const toRGBString = (r, g, b) => 'rgb(' + r + ',' + g + ',' + b + ')'
const toHexString = (r, g, b) => "#" + toHex(r) + toHex(g) + toHex(b)
const toHex = n => {
    const hex = Math.round(n ? n : 0).toString(16)
    return hex.length === 1 ? "0" + hex : hex
}

const creatHtmlUnsubscribeToggle = ( parentElement, title, appendAsSibling = false) => {
    const template      = document.createElement('div');
    template.innerHTML = `<input type = "checkbox" id = "unSub${title}" name = "unSub${title}" style = "visibility: hidden">
                          <label for = "unSub${title}" id="unSub${title}Label" class="unsubLabel" title="${title}">Unsubscribe ${title}</label>`

    appendAsSibling
        ? parentElement.parentNode.insertBefore( template, parentElement.nextSibling )
        : parentElement.appendChild( template )


    const [toggleElement, labelElement] = template.children;
    return toggleElement
}

const addUnSubscriberToggle = (observable, handlerName, toggleElement) => {
    toggleElement.labels[0].textContent = (toggleElement.checked ? "Subscribe " : "UnSubscribe ") + toggleElement.labels[0].title

    if (toggleElement.checked) {
        return observable(removeListener)(handlerName)
    } else {
        return observable(addListener)(handlerName)
    }


}
