---
description: Entweder Erfolgsfall mit Resultat oder Fehlerfall mit Fehlermeldung
---

# Either

## Beschreibung

### Either Type

Der Either Type wird häufig in funktionalen Programmiersprachen wie zum Beispiel Haskell oder Scala eingesetzt für das Error Handling. Der Either Type ist ein polymorpher Typ, der zwei Zustände annehmen kann. Für diese zwei Zustände gibt es die Wert-Konstruktoren `Left` und `Right`. Somit ist ein Either entweder ein `Left` oder ein `Right`. Beide tragen einen Wert mit sich: `Left` wird verwendet um im Fehlerfall die Fehlermeldung zu kapseln;  `Right` wird verwendet, um im Erfolgsfall den korrekten Wert zu kapseln. Durch den Either Type kann so in rein funktionalen Sprache elegant auf Fehler reagiert werden. Dabei gibt es keine Seiteneffekte, wie es ansonsten mit dem [`throw`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/throw) Statement in JavaScript geben würde.

#### Either Type Implementation:

```javascript
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
```

`Left` und `Right` sind zwei Funktionen die jeweils einen Wert und zwei Funktionen entgegen nehmen. Beide Funktionen ignorieren eine der beiden übergebenen Funktionen.`Left` wendet die linke \(erste übergebene\) Funktion auf den Parameter `x` an und ignoriert die zweite. `Right` wendet die rechte \(zweite übergebene\) Funktion auf den Parameter `x` an und ignoriert die erste. `Left` und `Right` bilden die Basis für einen weiteren Typ, den [Maybe Type](maybe.md).

## Verwendung

{% hint style="info" %}
Die Titel der Funktionen sind mit einem Link zur Implementation verknüpft.
{% endhint %}

Die folgenden Funktionen geben alle ein Either zurück und unterstützen so eine Fehlerbehandlung mit reinen Funktionen ohne Seiteneffekte. Somit können typische Fehler, die zum Beispiel auftreten wenn Werte `null` oder `undefined` sind, vermieden werden. Eine Funktion die ein Either zurück liefert hilft dem Anwender an den Fehlerfall zu denken und diesen zu behandeln.

### Allgemeine Anwendung für Funktionen, die ein _Either_ zurückgeben

Bei Funktionen, die ein Either zurückgeben können an den Funktionsaufruf zwei weitere Parameter übergeben werden. Der erste Parameter ist eine Funktion, die eine Fehlermeldung entgegen nimmt und dann eine Fehlerbehandlung durchführt. Der zweite Parameter ist eine Funktion für den Erfolgsfall, die das Resultat entgegen nimmt.

Allgemeines Schema:

Eine Either Funktion XYZ wird mit einem oder mehreren Parametern aufgerufen. Am Schluss vom Funktionsaufruf werden 2 Funktionen übergeben. Eine Funktion für den Fehlerfall \(Left Case\) und eine für den Erfolgsfall \(Right Case\).

```javascript
// Anwendung        
eitherXYZ(someParam)
    (error  => doSomethingInErrorCase(error)    )  // Left Case
    (result => doSomethingInSuccessCase(result) )  // Right Case
```

### [eitherTruthy](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L63)

Die `eitherTruthy`  Funktion erwartet einen Wert und überprüft ob dieser 'truthy' ist.  Im Erfolgsfall wird ein `Right` mit dem Element zurück gegeben und im Fehlerfall ein `Left` mit der entsprechenden Fehlermeldung.

{% hint style="info" %}
[Liste mit JavaScript 'falsy' Werten](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).
{% endhint %}

```javascript
const eitherTruthy = value =>
    value
        ? Right(value)
        : Left(`'${value}' is a falsy value`);
```

### [eitherNotNullAndUndefined](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L85)

Die `eitherNotNullAndUndefined` ****Funktion erwartet einen Wert und überprüft ob dieser nicht **null** oder **undefined** ist.

```javascript
const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);
```

### [eitherElementOrCustomErrorMessage](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L108)

Die `eitherElementOrCustomErrorMessage` Funktion erwartet eine Fehlermeldung und ein Element. Die Funktion überprüft das Element auf **null** oder **undefined** und gibt entweder ein `Right` mit dem Wert oder ein `Left` mit der übergebenen Fehlermeldung zurück.

```javascript
// Implementation
const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherNotNullAndUndefined(element)
     (_ => Left(errorMessage))
     (_ => Right(element));
 
// Anwendung       
eitherElementOrCustomErrorMessage("Der Wert ist Null")(null); // Left ("Der Wert ist null")
```

### [eitherDomElement](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L120)

Die `eitherDomElement`  Funktion nimmt eine Id für ein Dom-Element entgegen und gibt ein Either Type zurück. Im Erfolgsfall wird das HTML-Element zurückgegeben sonst eine Fehlermeldung, dass ein solches Element nicht existiert.

```javascript
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage
     (`no element exist with id: ${elemId}`)
     (document.getElementById(elemId));
```

### [eitherNumber](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L177)

Die `eitherNumber` Funktion überprüft ob ein Wert vom Typ Integer ist.

```javascript
const eitherNumber = val =>
    Number.isInteger(val)
        ? Right(val)
        : Left(`'${val}' is not a integer`);
```

### [eitherNaturalNumber](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L188)

Die `eitherNaturalNumber` Funktion überprüft ob der übergebene Wert eine natürliche JavaScript-Zahl ist.

```javascript
const eitherNaturalNumber = val =>
    Number.isInteger(val) && val >= 0
        ? Right(val)
        : Left(`'${val}' is not a natural number`);
```

### [eitherFunction](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L199)

Die `eitherFunction` Funktion überprüft ob ein Wert vom Typ _function_ ist.

```javascript
const eitherFunction = val =>
    typeof val === "function"
        ? Right(val)
        : Left(`'${val}' is not a function`);
```

### [eitherTryCatch](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L223)

Die `eitherTryCatch` Funktion nimmt eine Funktion `f` entgegen, die schief gehen könnte. Diese Funktion wird in einem try-catch Block ausgeführt. Wenn ein Fehler auftritt während der Funktionsausführung wird dieser gefangen und es wird ein `Left` mit der Fehlermeldung zurückgegeben, ansonsten ein `Right` mit dem Resultat.

{% hint style="info" %}
Diese Funktion hat den Zweck bestehende JavaScript Funktionen die noch auf die nicht funktionale Art Fehler mit `throw` werfen abzufangen und diese in die Welt der funktionalen Programmierung einzubetten. Somit fungiert diese Funktion als Brücke von der JavaScript Welt in die Welt der funktionalen Programmiersprachen.
{% endhint %}

```javascript
const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
}
```

### [eitherElementsOrErrorsByFunction](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b6edeaa62cf134fde7d3d57343bbc639f4fca2e/src/maybe/maybe.js#L240)

Die Funktion `eitherElementsOrErrorsByFunction` nimmt als ersten Parameter eine Funktion und als zweiten Parameter einen Rest Parameter \([JavaScript Rest Parameter](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/rest_parameters)\). Die Funktion die übergeben wird sollte einen Wert entgegen nehmen und ein Either Type zurückgeben. Die Funktion `eitherElementsOrErrorsByFunction` wendet dann die übergebene Funktion auf jeden Wert an der durch den Rest Parameter übergeben wurde. Zurück kommt ein Either. Im Erfolgsfall \(Right\) bekommt der Anwender eine ListMap mit allen "Erfolgs" -Werten. Im Fehlerfall bekommt der Anwender ein Stack mit allen Fehlermeldungen die aufgetreten sind.

{% hint style="info" %}
Sobald ein Funktionsaufruf schief geht, wird ein `Left` mit den Fehlermeldungen zurückgegeben.
{% endhint %}

{% hint style="info" %}
In Haskell hätte diese Funktion folgenden Typ:

```haskell
eitherElementsOrErrorsByFunction:: (a -> Either a) -> [a] -> Either [a]
```
{% endhint %}

**Beispiel**

```javascript
eitherElementsOrErrorsByFunction(eitherDomElement)("inputText", "output")
(err    => doSomethingWithErrorMessages) // stack mit Fehlermeldungen
(result => {                             // listMap mit den Resultaten

   // Die Resultate als einzelne Variablen
   const [inputText, output] = convertListMapToArray(result);
   
   doSomethingWithResult(inputText, output);
   
})
```







