import {maybeDivision, getOrDefault, eitherElementsOrErrorsByFunction, eitherDomElement} from "../maybe.js";
import {Box, fold, fmap} from "../../box/box.js";
import {reduce} from "../../stack/stack.js";
import {convertListMapToArray} from "../../listMap/listMap.js";

// Either all the necessary Dom-Element exist or display all missed Element
eitherElementsOrErrorsByFunction(eitherDomElement)('firstNumInput', 'secondNumInput', 'resultDivision', 'divisionBtn' )
(err => document.body.innerHTML = Box(err)
                                   (fmap)(reduce(acc => curr => acc + "<br>" + curr )("<h1>Error</h1>"))
                                   (fold)(txt => `<div style="background: #ffcccb; padding: 10px; border-radius: 1rem">${txt}</div>`))
(result => {

    const [firstNumInput, secondNumInput, resultDivision, divisionBtn] = convertListMapToArray(result);

    divisionBtn.onclick = () => {
        const [fstNum, sndNum] = [firstNumInput, secondNumInput].map(e => Number(e.value))
        resultDivision.textContent = getOrDefault(maybeDivision(fstNum)(sndNum))("Can't divide by zero")
    }

});
