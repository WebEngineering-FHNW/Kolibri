# Code Convention

## Naming

Im allgemeinen wird auf sprechende Namen gesetzt, sodass die Funktionen selbsterklärend sind.

Bei Abfragefunktionen, mit welcher der Anwender einen Wert anfordert, gibt der jeweilige Präfix des Funktionsnamens Aufschluss, von welchem Typ der Rückgabewert sein wird.

### get-Präfix

Funktionen die mit einem **get** beginnen, geben wenn möglich den gewünschten Wert ansonsten ein _undefined_ zurück.

> Funktion: **get**XYZ\
> Ergebnis: **Wert** oder _**undefined**_

Beispiele: [getElementByIndex](immutable-stack-erweiterungen.md#getelementbyindex), [getIndexOfElement](immutable-stack-erweiterungen.md#getindexofelement), [getDomElement](https://github.com/mattwolf-corporation/ip6\_lambda-calculus-in-js/blob/ab73376bb19c4bad3d78d0da4cf69a0271ce3aa7/src/maybe/maybe.js#L143), [getDomElements](https://github.com/mattwolf-corporation/ip6\_lambda-calculus-in-js/blob/ab73376bb19c4bad3d78d0da4cf69a0271ce3aa7/src/maybe/maybe.js#L155)

### maybe-Präfix

Funktionen die mit einem **maybe** beginnen, geben im Erfolgsfall ein [`Just`](maybe.md#maybe-type) mit den gewünschten Wert, ansonsten ein [`Nothing`](maybe.md#maybe-type) zurück.

> Funktion: **maybe**XYZ\
> Ergebnis: **Just(Wert)** oder **Nothing**

Beispiele: [maybeDivision](maybe.md#maybedivision), [maybeTruthy](maybe.md#maybetruthy), [maybeDomElement](maybe.md#maybedomelement), [maybeNumber](maybe.md#maybenumber)

### either-Präfix

Funktionen die mit einem **either** beginnen, geben im Erfolgsfall ein [`Right`](either.md#either-type) mit dem Resultat, ansonsten ein [`Left`](either.md#either-type) mit einer Fehlermeldung zurück.

> Funktionen: **either**XY\
> Ergebnis: **Left(Fehlerbehandlung)** oder **Right(Wert)**

Beispiele: [eitherTruhty](either.md#eithertruthy), [eitherNotNullAndUndefined](either.md#eithernotnullandundefined), [eitherDomElement](either.md#eitherdomelement), [eitherNumber](either.md#eithernumber), [eitherFunction](either.md#eitherfunction)

## Variablen Deklaration

Alle Konstruktionen sind mit dem Keyword `const` definiert. Somit können diese Variablen nicht überschrieben/verändert werden.

## Konzepte

### Konstante Konstrukte

Bei Konstruktionen soll darauf geachtet werden, dass diese aus **reinen Funktionen** bestehen.

### Die Brücke zwischen λ und JS

Objekte und Arrays werden nicht verwendet. Ausnahme gibt es bei Funktionen, die als Brücke zwischen den Welten _Lambda Kalkül_ und _JavaScript_ dienen.\
Das sind die _**Convert**_**-Funktionen**:

* [convertArrayToStack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#convertarraytostack)
* [converStackToArray](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#convertstacktoarray)
* converElementsToStack
* [converObjectToListMap](listmap.md#convertobjtolistmap)
* [convertListMapToArray](listmap.md#convertlistmaptoarray)

Für die Zahlen die _**Transformation**_**-Funktionen** zwischen _Church-_ und _JavaScript-Zahlen_:

* [jsNum](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#jsnum)
* [churchNum](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#churchnum)

## Formatierung

Bei den erstelleten Funktionen kommt es häufig vor, dass die Impementation aus einer einzigen Codezeile besteht. Die Leserlichkeit kann zum Teil darunter leiden weil die Zeile zu lang ist. Richtiges formatieren der Funktionen mit Zeilenumbrüchen, Einrückungen und Leerzeichen sind daher empfehlenswert und JavaScript ist dabei ziemlich unempfindlich. So darf der Code schön arrangiert werden, denn gut ausgerichteter Code fördert die Leserlichkeit immens.

### Workflow-Beispiel

Gegeben ist ein nicht formatierter Code: Ein Observable mit ein paar Listener, die hinzugefügt werden. Es ist schwer auf einem Blick zu sehen wieviel und welche Listener es sind, da sie in einer Reihe aufgelistet sind.

```javascript
const textInputObservables = Observable("")(addListener)(listenerNewValue)(addListener)(listenerOldValue)(addListener)(listenerNewValueSize)(addListener)(listenerConsoleLog)
```

#### Schritt 1: Zeilenumbrüche

> Wir sind gewohnt das Code Zeilen linksbündig ausgerichtet sind. Diese Struktur wird hier neu definiert. Wenn bei einer Funktion es zu mehrere Funktionsverknüpfungen mit Wertübermittlung kommt, ist es empfehlenswert diese Aufrufe untereinander zu schreiben.

```javascript
const textInputObservables = Observable("")
(addListener)(listenerNewValue)
(addListener)(listenerOldValue)
(addListener)(listenerNewValueSize)
(addListener)(listenerConsoleLog)
```

#### Schritt 2: Einrücken

> Einrücken der Funktion unterhalb der Haupt-Funktion in einer Linie plus einem Leerzeichen, macht es erkennbarer, dass sie zueinander gehören und darauf aufbauen.

```javascript
const textInputObservables = Observable("")
                              (addListener)(listenerNewValue)
                              (addListener)(listenerOldValue)
                              (addListener)(listenerNewValueSize)
                              (addListener)(listenerConsoleLog)
```

#### Schritt 3: Leerzeichen (Padding)

> Es ist schöner und lesbarer, wenn es zwischen den Werten in den Klammern mindestens ein Leerzeichen gibt. Somit bekommen alle Werte dieselbe Präsenz. Es ist dabei empfehlenswert die Klammern auf einer Linie untereinander zu bringen.

```javascript
const textInputObservables = Observable("")
                              (addListener)( listenerNewValue     )
                              (addListener)( listenerOldValue     )
                              (addListener)( listenerNewValueSize )
                              (addListener)( listenerConsoleLog   )
```

#### Schritt 4: Semikolon

> JavaScript versucht zwar selber eine Semikolon am Ende einer Anweisung einzufügen, wenn der Programmierer keine gesetzt hat. Hier ist aber nicht klar, ob die Anweisung für JavaScript fertig ist, denn es wäre mittels Funktionskomposition möglich immer weitere Funktionen anzufügen. Es ist darum besser immer ein Semikolon zu setzen, nicht nur um JavaScript zu signalisieren, dass es hier zu ende ist, sondern auch für die Leserlichkeit.

```javascript
const textInputObservables = Observable("")
                              (addListener)( listenerNewValue     )
                              (addListener)( listenerOldValue     )
                              (addListener)( listenerNewValueSize )
                              (addListener)( listenerConsoleLog   );
```

### Vergleichsbeispiele

#### Listeners-Deklaration

```javascript
// unformatiert
const listenerNewValue = newListener(listenerNewValueToDomElementTextContent(newValue));
const listenerOldValue = newListener(listenerOldValueToDomElementTextContent(oldValue));
const listenerNewValueSize = newListener(listenerNewValueLengthToElementTextContent(sizes));
const listenerConsoleLog = newListener(listenerLogToConsole);

// formatiert
const listenerNewValue     = newListener( listenerNewValueToDomElementTextContent    (newValue) );
const listenerOldValue     = newListener( listenerOldValueToDomElementTextContent    (oldValue) );
const listenerNewValueSize = newListener( listenerNewValueLengthToElementTextContent (sizes)    );
const listenerConsoleLog   = newListener( listenerLogToConsole                                  );
```

#### ForEach

```javascript
// unformatiert
forEach(jokes)((joke, _) => getElementByKey(joke)("btn").onclick = _ => HttpGet(getElementByKey(joke)("url"))(resp => jokePairObserver(setValue)(Box(resp)(mapf)(JSON.parse)(fold)(x => pair(getElementByKey(joke)("name"))(x[getElementByKey(joke)("jsonKey")])))));

// formatiert
forEach(jokes)( (joke, _) =>
    getElementByKey(joke)("btn").onclick = _ =>
        HttpGet( getElementByKey(joke)("url") )( resp =>
            jokePairObserver(setValue)( Box(resp)
                                         (mapf)( JSON.parse )
                                         (fold)( x => pair( getElementByKey(joke)("name") )( x[getElementByKey(joke)("jsonKey")] )))));
```

#### Box

```javascript
// unformatiert
const nextCharForNumberString = str => Box(str)(chain)(s => Box(s)(mapf)(s => s.trim()))(mapf)(r => parseInt(r))(mapf)(i => i + 1)(mapf)(i => String.fromCharCode(i))(fold)(c => c.toLowerCase())

// formatiert
const nextCharForNumberString = str =>
    Box(str)
     (chain)(s => Box(s)
                   (mapf)(s => s.trim()))
     (mapf)(r => parseInt(r))
     (mapf)(i => i + 1)
     (mapf)(i => String.fromCharCode(i))
     (fold)(c => c.toLowerCase());
```

## JS Doc

Das Dokumentieren der Funktionen mit der [JSDoc](https://jsdoc.app) bringt einige Vorteile. In den ersten Zeilen steht ein Text mit zwei bis drei Sätze, der fachlich erklärt was die Funktion tut. Anschliessend wird mit den JSDoc-Tags die Dokumentation mit Hinweisen erweitert:

* **@haskell** Typ deklaration in Haskell Notation
* **@sideffect** wenn die Funktion einen Side-Effekt auslöst wie zum Beispiel ein Log auf die Konsole
* **@function** markiert eine Funktion explizit als eine Funktion. Optional: Kann man der Funktion einen zweiten Name geben (Alias)
* **@param** für das erste Argument (hilfreich für die Pop-Up Informationen)
* **@return** wenn die Funktion mehrere Argumente/Funktionen erwartet (hilfreich für die Pop-Up Informationen)
* **@example** Beispiele wie die Funktion angewendet wird

Beispiel JS-Dokumentation an der Funktion [`getElementByIndex`](immutable-stack-erweiterungen.md#removebyindex)

```javascript
/**
 * A function that takes a stack and an index (as Church- or JS-Number).
 * The function returns the element at the passed index or undefined incl. a Error-Log to the Console
 *
 * @haskell getElementByIndex :: stack -> number -> a
 * @sideeffect Logs a error if index is no Church- or JS-Number or valid number
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber|number) : * } stack-value or undefined when not exist or invalid
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * getElementByIndex( stackWithNumbers )( n0 ) === id
 * getElementByIndex( stackWithNumbers )( n1 ) ===  0
 * getElementByIndex( stackWithNumbers )( n2 ) ===  1
 * getElementByIndex( stackWithNumbers )( n3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( 0 ) === id
 * getElementByIndex( stackWithNumbers )( 1 ) ===  0
 * getElementByIndex( stackWithNumbers )( 2 ) ===  1
 * getElementByIndex( stackWithNumbers )( 3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( "im a string" ) === undefined // strings not allowed, throws a Console-Warning
 */
const getElementByIndex = stack => index =>
    eitherElementByIndex(stack)(index)
     (console.error)
     (id);
```

In der IDEA (hier Intellij) wird die Dokumentation dementsprechend angezeigt:.

![Dokumentation in der IDEA](<../.gitbook/assets/image (8) (1).png>)

Ein sehr praktischer Vorteil, nebst der Dokumentation, sind die Pop-Up Informationen welche dem Anwender beim benutzen der Funktionen angezeigt werden. Der Anwender wird informiert, welcher Parameter als nächstes erwartet wird.

![Erste Parameter-Info](<../.gitbook/assets/image (6) (1).png>)

![Zweite Parameter-Info](<../.gitbook/assets/image (7) (1).png>)
