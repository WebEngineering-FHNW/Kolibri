export {
    listMap, emptyListMap, getElementByKey, removeByKey, startListMap
}
import {
    stack,
    size,
    stackPredecessor,
    head,
    reverseStack,
    hasPre,
    getPreStack,
    push,
    startStack,
    emptyStack
} from "../stack/stack.js";
import {n0} from "../lambda-calculus-library/church-numerals.js";
import {id, pair, fst, snd, If, Else, Then} from "../lambda-calculus-library/lambda-calculus.js";

const listMap = stack

const emptyListMap = listMap(n0)(id)( pair(id)(id) );

const startListMap = f => f(emptyListMap);

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

    return (times(iteration)(pair(reversedStack)(emptyListMap)))(snd)
}

const removeByCon = currentStack => resultStack => key => {
    const currentKeyValPair = head(currentStack)
    const currentElement = currentKeyValPair(snd);

    const currentKey = currentKeyValPair(fst)
    const result = key === currentKey
        ? resultStack
        : push(resultStack)(pair(currentKey)(currentElement));

    return pair(getPreStack(currentStack))(result);
}
