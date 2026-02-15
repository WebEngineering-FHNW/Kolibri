import {Observable, addListener, removeListener, listenerLogToConsole, listenerNewValueToDomElementTextContent, listenerOldValueToDomElementTextContent, newListener, listenerNewValueLengthToElementTextContent, setValue}from "../../observable.js";
import {eitherElementsOrErrorsByFunction, eitherDomElement} from "../../../maybe/maybe.js";
import {Box, fold, fmap} from "../../../box/box.js";
import {reduce, forEach, zip, convertElementsToStack} from "../../../stack/stack.js";
import {convertListMapToArray, convertListMapToStack} from "../../../listMap/listMap.js";
import {snd, fst} from "../../../lambda-calculus-library/lambda-calculus.js";


const startProgram = domElements => {
    // Get the elements
   const [inputText, newValue, oldValue, sizes] = convertListMapToArray(domElements);

    // Create Listener
    const listenerNewValue      = newListener( listenerNewValueToDomElementTextContent    (newValue) );
    const listenerOldValue      = newListener( listenerOldValueToDomElementTextContent    (oldValue) );
    const listenerNewValueSize  = newListener( listenerNewValueLengthToElementTextContent (sizes)    );
    const listenerConsoleLog    = newListener( listenerLogToConsole                                  );

    // Create Observable-Object, define the Initial-Value and append the Listeners
    let textInputObservables = Observable("")
                                (addListener)( listenerNewValue     )
                                (addListener)( listenerOldValue     )
                                (addListener)( listenerNewValueSize )
                                (addListener)( listenerConsoleLog   );

    // Connect the Observables with the Input-Text-Field.
    // Every change in the Input-Field execute the 'setValue'-Function with the new value from Input-Field.
    inputText.oninput = _ =>
        textInputObservables = textInputObservables(setValue)(inputText.value);



    //For demonstration, how to Un- & Subscribe the Handler from the Observable-Object
    eitherElementsOrErrorsByFunction(eitherDomElement)("unsubNewValue", "unsubOldValue", "unsubSize" )
    (err => document.body.appendChild( Box(err)
                                        (fmap)(reduce(acc => curr => acc + "<br>" + curr )("<h1>Warn Un- & Subscribe</h1>"))
                                        (fmap)(txt => `<div style="background: #ffcccb; padding: 10px; border-radius: 1rem">${txt}</div>`)
                                        (fold)(tag => document.createRange().createContextualFragment(tag)))
    )
    (result =>
        forEach( zip( convertListMapToStack(result) )( convertElementsToStack(listenerNewValue,listenerOldValue,listenerNewValueSize)) )((pairEle, _) =>
            pairEle(fst).onclick = _ =>
                textInputObservables =
                    pairEle(fst).checked
                        ? textInputObservables(addListener)(pairEle(snd))
                        : textInputObservables(removeListener)(pairEle(snd)))
    )

}

// Either all the necessary Dom-Element exist or display all missed Element
eitherElementsOrErrorsByFunction(eitherDomElement)("inputText", "newValue", "oldValue", "sizes" )
(err => document.body.innerHTML = Box(err)
                                    (fmap)(reduce(acc => curr => acc + "<br>" + curr )("<h1>Error</h1>"))
                                    (fold)(txt => `<div style="background: #ffcccb; padding: 10px; border-radius: 1rem">${txt}</div>`))
(startProgram)



const checkElementsByFunction = f => (...elems) =>
    elems.reduce(acc => curr => {
        const result = f(curr);
        if (acc.isFailed) {
            if (!result) {
                return acc.values.push('element with id: ' + result + 'not found');
            }
        } else {
            if (result) {
                return acc.values.push(result);
            } else {
                acc.values = [] // clear elements
                acc.values.push('element with id: ' + result + 'not found');
                acc.isFailed = true;
                return acc;
            }
        }
    }, {values: [], isFailed: false});



