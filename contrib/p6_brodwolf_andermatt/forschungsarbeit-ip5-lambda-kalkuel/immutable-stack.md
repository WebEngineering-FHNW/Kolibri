# Immutable Stack

## Beschreibung

### Stack

Der Stack ist eine rein funktionale Datenstruktur und daher unveränderlich. Der Stack ist als [Tripel](einfache-kombinatoren.md#triple) implementiert. Ein Tripel ist eine weitere rein funktionale Datenstruktur, die drei Werte hält. Über "getter"-Funktionen kann auf diese Werte des Tripels zugegriffen werden. Der erste Wert des Tripels stellt die Größe (Anzahl der Elemente) des Stacks dar. Gleichzeitig repräsentiert der erste Wert, den Index des Kopfes (oberster Wert), des Stacks. Die Grösse/der Index, des Stacks wird als [Church-Zahl ](church-encodings-zahlen-und-boolesche-werte.md#church-zahlen)angegeben. Der zweite Wert repräsentiert den Vorgänger-Stack. Der dritte Wert stellt den Kopf ( oberster Wert ) des Stacks dar.

Stack Implementation:

```javascript
const stack = x => y => z => f => f(x)(y)(z);
```

### Empty-Stack

Zur späteren Verwendung von einem Stack wird der leere Stack als Grundbaustein benötigt. Der leere Stack hat die Grösse/ den Index Null. Der leere Stack hat keinen Vorgänger, stattdessen hat er die [Identitätsfunktion](einfache-kombinatoren.md) als Platzhalter. Ausserdem bestitzt der leere Stack keinen Kopf (oberster Wert), sondern hat als Platzhalter die Identitätsfunktion.

Implementation des leeren Stacks:

```javascript
const emptyStack = stack(n0)(id)(id);
```

## Aufbau

Ein kleines grafisches Beispiel wie ein Stack aussieht. In diesem Beispiel wird ein Stack mit Emoji's erstellt:

| stack-name | stack                      | code                              |
| ---------- | -------------------------- | --------------------------------- |
| emptyStack | (n0)(id)(id)               | const s1 = push(empyStack)( 😎 ); |
| s1         | (n1)(**emptyStack**)( 😎 ) | const s2 = push(s1)( 🤓 );        |
| s2         | (n2)(**s1**)( 🤓 )         | const s3 = push(s2)( 👾 );        |
| s3         | (n3)(**s2**)( 👾 )         |                                   |

s3 = (n3)( (n2)( (n1)( (n0)(id)(id) )(😎) )(🤓) )(👾)

Der Stack **s3** besteht nun aus den Elementen: 😎, 🤓, 👾 .

* Element an Index 1:😎
* Element an Index 2:🤓
* Element an Index 3:👾

## Verwendung

### push

Um einen Stack zu erstellen fügt man Elemente, dem leeren Stack hinzu. Dafür gibt es die Push-Funktion. Die Push-Funktion nimmt einen Stack und einen Wert entgegen. Der übergebene Wert, wird auf den übergegebenen Stack hinzugefügt.

Beispiel:

```javascript
const stackWithOneValue = push(emptyStack)(1);
```

Nun besitzt der Stack von oben den Wert 1.

### pop

Um den obersten Wert vom Stack zu entfernen gibt es die pop-Funktion. Die pop-Funktion gibt ein [Pair](einfache-kombinatoren.md) zurück. Dieses Pair besteht aus dem vorgänger-Stack und dem Wert, der vom Stack entfernt wurde. Mit den "getter"-Funktionen für Pairs, kann auf die Werte zugegriffen werden.

Beispiel:

```javascript
const resultPair = pop(stackWithOneValue); 

const predecessorStack = resultPair(fst);    // empty stack
const poppedValue = resultPair(snd);         // 1
```

## Weitere Funktionen

### size

Um auf den auf die Grösse eines Stacks zuzugreifen gibt es die Funktion size. Diese Funktion nimmt einen Stack entgegen und gibt die Grösse, des Stacks als [Church-Zahl](church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) zurück.

Beispiel:

```javascript
const sizeOfStack = size(stackWithOneValue); // n1
```

### head

Um auf den Kopf (oberster Wert) des Stacks zuzugreifen gibt es die Funktion head. Diese Funktion nimmt ein Stack entgegen und gibt den Kopf des Stacks zurück.

Beispiel:

```javascript
const headValue = head(stackWithOneValue); // 1
```

### hasPre

Die Funktion hasPre nimmt einen Stack entgegen und gibt ein [Church-Boolean](einfache-kombinatoren.md#church-boolean) zurück, der aussagt ob der übergegebene Stack einen Vorgänger hat oder nicht.

Beispiel:

```javascript
const result = hasPre(stackWithOneValue); // false (as church-boolean)
```

## Element per Index holen

### getElementByIndex

Die Funktion `getElementByIndex` nimmt einen Stack und eine [Church-](church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) oder JS-Zahl, die den Index des Elements repräsentiert, entgegen. Falls an diesem Index ein Element existiert, wird dieses zurückgegeben ansonsten wird auf der Console einer Error-Hinweis erscheinen.

Beispiel:

```javascript
const stackWithTwoElements = push(push(emptyStack)("Hello"))("World");

getElementByIndex(stackWithTwoElements)(n1); // "Hello"
getElementByIndex(stackWithTwoElements)(n2); // "World"

getElementByIndex(stackWithTwoElements)(1); // "Hello"
getElementByIndex(stackWithTwoElements)(2); // "World"

getElementByIndex(stackWithTwoElements)(999); // Error "invalid index"
```

## Stack zu einem Array konvertieren und umgekehrt

### convertStackToArray

Die Funktion `convertStackToArray` nimmt einen Stack entgegen und gibt einen Array mit denselben Elementen zurück.

Beispiel:

```javascript
const stackWithTwoElements = push(push(emptyStack)(1))(2);
const arrayWithTwoElements = convertStackToArray(stackWithTwoElements); // [1, 2]
```

### convertArrayToStack

Die Funktion `convertArrayToStack` nimmt einen Array entgegen und gibt einen neuen Stack mit den Elementenn vom übergebenen Array zurück.

Beispiel:

```javascript
const array = [1, 2, 3];
const stack = convertArrayToStack(array); // stack: 1, 2, 3
```

## Stack umkehren

### reverseStack

Die Funktion `reverseStack` nimmt einen Stack entgegen und gibt einen neuen Stack zurück, bei diesem die Elemente in umgekehrter Reihenfolge sind.

Beispiel:

```javascript
const stackWithTwoElements = push(push(emptyStack)(1))(2);
const reversedStack = reverseStack(stackWithTwoElements); // stack: 2, 1
```

## Stack - Reduce, Map und Filter

Die JavaScript Funktionen `reduce`, `map` und `filter` wurden auch für den Stack implementiert.

### Reduce

Reduce nimmt einen Stack entgegen und ein Argument-[Pair](einfache-kombinatoren.md#pair). Das erste Argument des Paares muss eine reduce-Funktion(wie bei JavaScript reduce). Das zweite Argument muss ein Startwert sein. Die Funktion gibt den reduzierten Wert zurück.

Beispiel:

```javascript
const stackWithNumbers  = convertArrayToStack([0,1,2]);

const reduceFunctionSum = acc => curr => acc + curr;
reduce( reduceFunctionSum )( 0 )( stackWithNumbers )          // returns  3
reduce( reduceFunctionSum )( 0 )( push(stackWithNumbers)(3) ) // returns  5
reduce( reduceFunctionSum )( 5 )( stackWithNumbers )          // returns  8
reduce( reduceFunctionSum )( 5 )( push(stackWithNumbers)(3) ) // returns 10

const reduceToArray = acc => curr => [...acc, curr];
reduce( reduceToArray )( [] )( stackWithNumbers )              // returns [0, 1, 2]
```

### Map

Map nimmt einen Stack und eine map-Funktion (wie bei JavaScript Array map) entgegen. Zurück gibt die Funktion einen neuen Stack mit den "gemappten" Werten.

Beispiel:

```javascript
const stackWithTwoElements = push(push(emptyStack)(1))(2);
const multiplyWithTwo = x => x * 2;

const mappedStack = map(stackWithTwoElements)(multiplyWith2); // stack: 2, 4
```

### Map with Reduce

Ausserdem gibt es noch eine MapWithReduce-Funktion die mittels der obenstehenden reduce-Funktion implementiert ist. Sie nimmt auch einen Stack und eine Map-Funktion entgegen. Diese Funktion kann genau gleich wie die Map Funktion verwendet werden.

Implementation:

```javascript
const mapWithReduce = s => map => reduce(s)(pair(acc => curr => push(acc)(map(curr)))(emptyStack));
```

### Filter

Filter nimmt einen Stack und eine filter-Funktion (wie bei JavaScript Array filter) entgegen. Die Funktion gibt den gefilterten Stack zurück. Wenn keine Elemente dem Filter entsprechen wird der leere Stack zurückgegeben.

Beispiel:

```javascript
const stackWithThreeElements = push(push(push(emptyStack)(1))(2))(3);
const filterFunction = x => x > 1 && x < 3;

const filteredStack = filter(stackWithTwoElements)(filterFunction); // stack: 2
```

### Filter with Reduce

Ausserdem gibt es noch eine FilterWithReduce-Funktion die mittels der obenstehenden reduce-Funktion implementiert ist. Sie nimmt auch einen Stack und eine Filter-Funktion entgegen. Diese Funktion kann genau gleich wie die Filter Funktion verwendet werden.

Implementation:

```javascript
const filterWithReduce = s => filter => reduce(s)(pair(acc => curr => filter(curr) ? push(acc)(curr) : acc)(emptyStack));
```

## ForEach-Loop

Die Funktion forEach nimmt einen Stack und eine Callback-Funktion entgegen. Die Funktion iteriert über den Stack und ruft in jeder Iteration die Callbackfunktion auf. Der Callbackfunktion werden zwei Argumente übergeben. Das erste Argument ist das Element von der aktuellen Iterationsrunde. Das zweite Argument ist der Index, des Elements.

Beispiel:

```javascript
const stackWithNumbers = startStack(pushToStack)(5)(pushToStack)(10)(id);

const callbackFunc = (element, index) => {
    console.log('element at: ' + index + ': ' + element);
};

forEach(stackWithNumbers)(callbackFunc); // element at: 1: 5
                                         // element at: 2: 10

```

Bei der Implementierung von der forEach-Funktion wurde für die eigentliche Iteration [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) verwendet.

{% hint style="info" %}
Die forEach-Funktion für Stacks funktioniert gleich wie die JavaScript forEach Schlaufe.
{% endhint %}

## Nützliche Helferfunktionen

### Stack auf der Konsole ausgeben - logStackToConsole

Die Funktion logStackToConsole nimmt einen Stack entgegen und führt einen Seiteneffekt aus. Der Seiteneffekt loggt den Stack auf die JavaScript-Konsole.

Beispiel:

```javascript
const stackWithThreeElements = push(push(push(emptyStack)(1))(2))(3);
logStackToConsole(stackWithThreeElements);
```

![](../.gitbook/assets/bildschirmfoto-2020-01-14-um-06.54.01.png)

### Stack erstellen mit Helferfunktion - startStack

Die pushToStack Funktion wird der startStack Funktion übergeben. Danach folgt der erste Wert, der hinzugefügt werden soll. Für weitere Werte kann nochmals die pushToStack Funktion und ein weiteres Element hinzugefügt werden. Dies kann solange gemacht werden, wie man möchte. Um das Erstellen abzuschliessen, wird am Schluss die [Identitätsfunktion](einfache-kombinatoren.md#id-die-identitaetsfunktion) übergeben.

```javascript
const result = startStack(pushToStack)(2)(pushToStack)(3)(pushToStack)(4)(id); // Stack: 2, 3, 4
```

Durch diese Helferfunktion lassen sich Stacks bequemer erstellen.

## Eigenschaften der Funktionen vom Stack

* Alle Funktionen sind **rein** (mit Ausnahme logStackToConsole).
* In allen Funktionen gibt es **keine** Ausdrücke wie _`for`_, _`while`_ oder `do` **Schleifen**.
* Die [Iteration ist mit church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md) implementiert.
