



// const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)

const execute = (...fns) => returnValue => {
    fns.reduce((_, fn) => fn); // use immutable Stack
    return returnValue
}

// const ObservableFP = value => {
//     return {
//         addListener:  callback => {
//
//         },
//         getValue: () => value,
//         setValue: newValue =>{}
//     }
// }

import {
    Else,
    firstOfTriple,
    fst,
    id, If,
    pair,
    secondOfTriple,
    snd, Then,
    thirdOfTriple, triple
} from "../../lambda-calculus-library/lambda-calculus";
import {eq, jsnum, n1, succ} from "../../lambda-calculus-library/church-numerals";
import {emptyStack, hasPre, head, push, reverseStack, size, stackIndex, stackPredecessor} from "../../stack/stack";

const ObsObject = listeners => obsFn => obsFn(listeners)

const InitObservable = ObsObject(emptyStack)

// Obseverable Functions obsFN
const addListener = listeners => newCallback =>
    ObsObject( push(listeners) (newCallback) )

const setValue = listeners => newVal =>
    forEach(listeners)((callback, index) => callback(newVal))

const removeListener = listeners => index =>
    ObsObject( removeByIndex(listeners)(index) )


// Variante mit x

const InitObsverableVal = startVal => ObsObjectVal(emptyStack)(startVal)

const ObsObjectVal = listeners => val => obsFn =>
        obsFn(listeners)(val)

const addListenerVal = listeners => val => callback =>
        ObsObjectVal( push(listeners) (callback) ) (val)

const setValueVal = listeners => val => newVal => {
    forEach(listeners)((callback, _) => (callback(snd))(newVal)(val) )
    return ObsObjectVal(listeners)(newVal)
}

const removeListenerVal = listeners => val => key =>
    ObsObjectVal( removeByKey(listeners)(key) )(val)


const removeByIndex = s => i => {
    const times = size(s);
    const reversedStack = reverseStack(s);

    const iteration = argsTriple => {
        const currentStack = argsTriple(firstOfTriple)
        const resultStack = argsTriple(secondOfTriple)
        const currentIndex = argsTriple(thirdOfTriple)

        return If(hasPre(currentStack))
        (Then(removeByCondition(currentStack)(resultStack)(i)(currentIndex)))
        (Else(argsTriple))
    }

    return (times(iteration)(triple(reversedStack)(emptyStack)(n1)))(secondOfTriple)
}

const removeByCondition = currentStack => resultStack => i => currentIndex => {
    const currentElement = head(currentStack);

    const condition = eq(toChurchNum(i))(currentIndex);
    const result = If(condition)
    (Then(resultStack))
    (Else(push(resultStack)(currentElement)));


    return triple(getPreStack(currentStack))
    (result)
    (successor(currentIndex));
}

const logListener = s => _ => {
    const logIteration = (acc, curr) => {
        const index = acc + 1;
        const val = typeof(curr) === 'object' ? JSON.stringify(curr) : curr;
        console.log('element at: ' + index + ': ' + showPair(val));
        return index;
    };
    reduce(s)(pair(logIteration)(0));
};


const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback); // callback is a function
            callback(value, value);
        },
        getValue: () => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};

const ObservableList = newList => {
    const list = [...newList]
    const addListeners = [];
    const delListeners = [];
    const removeAt = array => index => array.splice(index, 1);
    const removeItem = array => item => {
        const i = array.indexOf(item);
        if (i >= 0) removeAt(array)(i);
    };
    const listRemoveItem = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach(listener => listener(item))
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach((listener, index) => listener(item, () => delListenersRemove(index)));
        },
        removeDeleteListener: removeItem(delListeners),
        count: () => list.length,
        countIf: pred => list.reduce((sum, item) => pred(item) ? sum + 1 : sum, 0),
        getList: () => [...list]
    }
};


const getElementByKey = s => key => {
    const times = size(s);
    const initArgsPair = pair(s)(id);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const predecessorStack = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);

        if (currentKeyValPair(fst) === key) {

            return pair(predecessorStack)(currentKeyValPair(snd));
        }

        return pair(predecessorStack)(argsPair(snd));
    };

    return (times(getElement)(initArgsPair))(snd);
};

// const removeByIndex = stack => index => {
//     const times = size(stack);
//     const reversedStack = reverseStack(stack);
//
//     const iteration = argsTriple => {
//         const currentStack  = argsTriple(firstOfTriple)
//         const resultStack   = argsTriple(secondOfTriple)
//         const currentIndex  = argsTriple(thirdOfTriple)
//         const condition = eq(toChurchNum(index))(currentIndex);
//
//         return If( hasPre(currentStack) )
//         (Then( removeByCondition(currentStack)(resultStack)(condition)(currentIndex)))
//         (Else(argsTriple))
//     }
//
//     return (times(iteration)(triple(reversedStack)(emptyStack)(n1)))(secondOfTriple)
// }

const removeByKey = stack => key => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = argsPair => {
        const currentStack  = argsPair(fst)
        const resultStack   = argsPair(snd)

        return If( hasPre(currentStack) )
        (Then( removeByCon(currentStack)(resultStack)(key)))
        (Else(argsPair))
    }

    return (times(iteration)(pair(reversedStack)(emptyStack)))(snd)
}

const removeByCon = currentStack => resultStack => key => {
    const currentKeyValPair = head(currentStack)
    const currentElement = currentKeyValPair(snd);

    const result = key === currentKeyValPair(fst)
        ? resultStack
        : push(resultStack)(currentElement);

    return pair(getPreStack(currentStack))(result);
}