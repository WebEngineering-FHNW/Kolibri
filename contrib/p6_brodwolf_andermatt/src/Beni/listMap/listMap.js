const toChurchNum = n => n === 0 ? n0 : succ(toChurchNum(n - 1))
// const If = condition => truthy => falshy => condition(truthy)(falshy)
const If = condition => truthy => falsy => condition(truthy)(falsy)
const Then = id;
const Else = id;
const getPreStack = s => s(stackPredecessor)


/* ListMap
put
get
size
clear
 */
const listMap = stack
const emptyListMap = listMap(n0)(id)( pair(id)(id) );



const mapFn = p => {
    const mappedValue = p(snd).toUpperCase();
    return pair( p(fst) ) (mappedValue)
}

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

    return (times(iteration)(pair(reversedStack)(emptyStack)))(snd)
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


// lm = emptyListMap
// lm = push(lm)(pair(32)("Pascal"))
// lm = push(lm)(pair(15)("Beni"))
// lm = push(lm)(pair(12)("Kevin"))
// lm = push(lm)(pair(31)("Naida"))

lm = startStack
(pushToStack) ( pair(32)("Pascal") )
(pushToStack) ( pair(15)("Beni")   )
(pushToStack) ( pair(12)("Kevin")  )
(pushToStack) ( pair(31)("Naida")  )
(id)


lm2 = map(lm)(mapFn)
forEach(lm2)((p, _) => console.log(showPair(p)) )
