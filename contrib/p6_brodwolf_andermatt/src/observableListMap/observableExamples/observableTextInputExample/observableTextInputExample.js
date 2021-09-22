import { InitObservable, addListener, removeListenerByHandler, handlerFnLogToConsole, buildHandlerFnInnerText, buildHandlerFnInnerTextOldValue, handlerBuilder, buildHandlerFnInnerTextLength } from "../../observableListMap.js";
import { onInputListener } from "../observableUtilities.js";
import { getSafeElements } from "../../../maybe/maybe.js";

// The Elements from the Dom
const [inputText, newValue, oldValue, sizes] = getSafeElements("inputText", "newValue", "oldValue", "sizes")

// Define Observable-Handler
const newValueHandler     = handlerBuilder(1)( buildHandlerFnInnerText          (newValue) )
const oldValueHandler     = handlerBuilder(2)( buildHandlerFnInnerTextOldValue  (oldValue) )
const labelSizeHandler    = handlerBuilder(3)( buildHandlerFnInnerTextLength    (sizes)    )
const consoleHandler      = handlerBuilder(4)( handlerFnLogToConsole                       )

// Create Observable-Object, define InitVal and append the Observable-Handler as Listener
let inputObservable = InitObservable("")
                            (addListener)(newValueHandler)
                            (addListener)(oldValueHandler)
                            (addListener)(labelSizeHandler)
                            (addListener)(consoleHandler)

// Connect the Observable-Object with the Input-Text-Field
onInputListener(inputObservable, inputText)



//For demonstration, how to Un- & Subscribe the Handler from the Observable-Object
const [unsubNewValue,unsubOldValue,unsubSize] = getSafeElements("unsubNewValue", "unsubOldValue", "unsubSize")

unsubNewValue.onclick = _ => {
    inputObservable = unsubNewValue.checked
        ? inputObservable(addListener)(newValueHandler)
        : inputObservable(removeListenerByHandler)(newValueHandler)

    onInputListener(inputObservable, inputText)
}

unsubOldValue.onclick = _ => {
    inputObservable = unsubOldValue.checked
        ? inputObservable(addListener)(oldValueHandler)
        : inputObservable(removeListenerByHandler)(oldValueHandler)

    onInputListener(inputObservable, inputText)
}

unsubSize.onclick = _ => {
    inputObservable = unsubSize.checked
        ? inputObservable(addListener)(labelSizeHandler)
        : inputObservable(removeListenerByHandler)(labelSizeHandler)

    onInputListener(inputObservable, inputText)
}


