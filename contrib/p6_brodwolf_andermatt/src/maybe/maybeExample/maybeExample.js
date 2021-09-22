import { maybe, maybeElement, maybeDiv, getOrDefault} from "../maybe.js";
import {id} from "../../lambda-calculus-library/lambda-calculus.js";

const calcDiv = () => {
    const fstNum = maybe(maybeElement('firstNumInput'))
                            (() => console.error('firstNumInput doesnt exist'))
                            (elem => Number(elem.value));

    const sndNum = maybe(maybeElement('secondNumInput'))
                            (() => console.error('secondNumInput doesnt exist'))
                            (elem => Number(elem.value));

    const result = maybe(maybeElement('result'))
                            (() => console.error('result doesnt exist'))
                            (id);

    result.innerText = getOrDefault(maybeDiv(fstNum)(sndNum))(0);
}

maybe(maybeElement('divisionBtn'))
        (() => console.error('divisionBtn doesnt exist'))
        (btn => btn.onclick = calcDiv);