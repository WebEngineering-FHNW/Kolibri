# Benchmark und unsere Erkenntnisse

## BenchmarkTest

Um Funktionen auf ihre Ausführungsgeschwindigkeit zu prüfen wurde die Funktion `BenchmarkTest` dem TestFramework hinzugefügt. Mit der Zeitstempel Methode  `performance.now()` von JavaScript **** kann die Ausführungsdauer der Funktion `methodUnderTest` berechnet werden. Die Werte, die von `Performance.now()` zurückgegeben werden sind immer in einem konstanten Tempo, unabhängig von der Systemuhr.

```javascript
const BenchmarkTest = mutName => methodUnderTest => {
    const t0 = performance.now(); // Timer start

    const result = methodUnderTest();

    const t1 = performance.now(); // Timer stop

    const milliseconds = t1 - t0; 
    const timeCondition = milliseconds >= 600;
    const time = timeCondition ? milliseconds / 1000 : milliseconds;

    console.log(`Call Method ${mutName} took ${time.toFixed(2)} ${timeCondition ? 'seconds' : 'milliseconds'}.`);

    return result;
}
```

## Unsere Erkenntnisse mit der Funktion BenchmarkTest

### forEach-Methode des [Immutable-Stack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#foreach-loop)

Bei der Anwendung des Observables ist uns aufgefallen, dass die Benachrichtigung der Listener viel zu lange ging. Wir haben uns danach gefragt, welcher Teil so viel Zeit in Anspruch nimmt für die Ausführung. Danach untersuchten wir die `forEach` Methode, die bei der Benachrichtigung der Listener eine zentrale Rolle spielt. Wir haben die Methode analysiert und festgestellt dass in jeder Iterationsrunde eine weitere Iteration gestartet wird \(ähnlich wie eine for-Schleife in einer for-Schleife\), die jedoch nicht benötigt wird. 

Anstelle den Index in jeder Iterationsrunde aus dem Stack via `jsnum` zu berechnen, wurde der Index in jeder Iteration um eins erhöht und der nächsten Iterationsrunde mitgegeben. Das Problem bei der Funktion `jsnum` ist das diese mit einer rekursiven Implementation eine Church Zahl in eine JavaScript Zahl umwandelt.

Nach dem Refactoring war die `forEach` Methode massiv viel schneller \(mehr als doppelt so schnell\) . Wir haben einen kleinen Benchmark Test erstellt, der misst wie lange eine Ausführung dauert und konnten dadurch einen erheblichen Unterschied feststellen.

Implementation: `forEach`vor dem Refactoring

```javascript
const forEach = stack => callbackFunc => {
    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if( convertToJsBool(hasPre(s)) ) {
            const element = head(s);
            const index   = jsnum( succ( churchSubtraction(times)(size(s) )));

            callbackFunc(element, index);

            return ( pop(s) )(fst);
        }
        return s;
    };

    times
        (iteration)
        (reversedStack);
};
```

Implementation: `forEach` nach dem Refactoring

```javascript
const forEach = stack => callbackFunc => {
    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    const invokeCallback = p => {
        const s       = p(fst);
        const index   = p(snd);
        const element = head(s);

        callbackFunc(element, index);

        return pair( getPreStack(s) )( index + 1 );
    }

    const iteration = p =>
        If( hasPre( p(fst) ))
            ( Then( invokeCallback(p) ))
            ( Else(                p  ));

    times
        (iteration)
        (pair( reversedStack)(1) );
};
```



