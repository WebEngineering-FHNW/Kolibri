---
description: >-
  Neue Funktionen für den Stack: concat, flatten, zipWith, zip, stackEquals,
  getElementByIndex, removeByIndex, getIndexOfElement, maybeIndexOfElement,
  containsElement, convertElementsToStack
---

# Immutable Stack Erweiterungen

## Basis

Die Funktionen in diesem Kapitel sind neu zum [Immutable Stack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md) hinzugekommen.

{% page-ref page="../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md" %}

{% hint style="danger" %}
Der Index bei einem Stack beginnt bei 1. Der Index 0 ist reserviert für den [`emptyStack`](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#empty-stack). Am Index 0 steht immer das Element `id`.
{% endhint %}

{% hint style="info" %}
In den folgenden Beispielen wird zur besseren Übersicht, die Stack Datenstruktur wie folgt dargestellt:**`[ element1, element2, element3, ... ]`**
{% endhint %}

## Erweiterungen

{% hint style="info" %}
Die Titel der Funktionen sind mit einem Link zur Implementation verknüpft
{% endhint %}

### [concat](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L732)

Die Funktion `concat` nimmt zwei Stacks entgegen und konkateniert diese.

```javascript
const stack1  = convertArrayToStack( ["Hello", "Haskell"] );
const stack2  = convertArrayToStack( ["World", "Random"] );

concat(stack1)(stack2); // [ "Hello", "Haskell", "World", "Random" ]


const stack3 = convertArrayToStack( [1, 2, 3] );
const stack4 = convertArrayToStack( [4] );
concat(stack3)(stack4)  // [ 1, 2, 3, 4 ]
```

### [flatten](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L766)

Die Funktion `flatten` nimmt einen Stack entgegen, dessen Einträge Stacks sind. Die Funktion verknüpft diese alle zusammen zu einem Stack. Das Tiefenlevel, bis zu welcher die Struktur abgeflacht wird ist 1.

```javascript
const s1 = convertArrayToStack( [1, 2] );
const s2 = convertArrayToStack( [3, 4] );
const s3 = convertArrayToStack( [5, 6] );

const stackWithStacks = convertArrayToStack( [s1, s2, s3] ); // [ [1, 2], [3, 4], [5, 6] ]

flatten(stackWithStacks) // [ 1, 2, 3, 4, 5, 6]
```

### [zipWith](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L793)

Die `zipWith`Funktion nimmt eine Verknüpfungsfunktion und zwei Stacks entgegen. Anhand der Verknüpfungsfunktion werden die Elemente der beiden übergebenen Stacks paarweise miteinander verknüpft zu einem neuen Stack.

{% hint style="info" %}
Wenn einer der beiden übergebenen Stacks kürzer ist wird nur bis zum letzten Element des kürzeren Stacks verknüpft.
{% endhint %}

```javascript
const add = x => y => x + y;

const s1 = convertArrayToStack( [1, 2] );
const s2 = convertArrayToStack( [4, 5] );

zipWith(add)(s1)(s2) // [ 5, 7 ]
```

### [zip _\(with pair\)_](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L846)

Die `zip` Funktion nimmt zwei Stacks entgegen und verknüpft die beiden Stacks mit der Funktion `pair`.

{% hint style="info" %}
Wenn einer der beiden übergebenen Stacks kürzer ist wird nur bis zum letzten Element des kürzeren Stacks verknüpft.
{% endhint %}

```javascript
const s1 = convertArrayToStack( [1, 2] );
const s2 = convertArrayToStack( [3, 4] );

zip(s1)(s2)  // [ (1, 3), (2, 4) ]
```

### [stackEquals](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L861)

Die Funktion `stackEquals` nimmt zwei Stacks entgegen und vergleicht alle Elemente mit dem JavaScript `===` Operator auf Gleichheit. Wenn alle Vergleiche `true` ergeben, gibt die Funktion ein Church-Boolean `True` ansonsten ein Church-Boolean `False` zurück.

```javascript
const s1 = convertArrayToStack( [1, 2] );
const s2 = convertArrayToStack( [1, 2] );

stackEquals(s1)(s2)  // True (Church Boolean)
```

### [getElementByIndex](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L242)

Die Funktion `getElementByIndex` nimmt einen Stack und eine [Church-](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) oder JS-Zahl, die den Index des Elements repräsentiert, entgegen. Falls an diesem Index ein Element existiert, wird dieses zurückgegeben ansonsten wird auf der Console einer Error geloggt und der Rückgabewert ist `undefined`. 

#### Anwendungs Beispiel:

```javascript
const stackWithStrings = convertArrayToStack(["Hello", "World"]);

getElementByIndex(stackWithStrings)(n1) // "Hello"
getElementByIndex(stackWithStrings)(n2) // "World"

getElementByIndex(stackWithStrings)( 1)  // "Hello"
getElementByIndex(stackWithStrings)( 2)  // "World"

getElementByIndex(stackWithStrings)(999) // Error "invalid index" 
```

{% hint style="info" %}
Der Anwender muss nicht mehr entscheiden, welche Funktionen er braucht:  `getElementByChurchNumberIndex` oder `getElementByJsNumIndex`.   
Die Funktion `getElementByIndex`wurde erweitert, dass der Index auf den "Typ" kontrolliert wird mittels `eitherFunction` und `eitherNaturalNumber`. So kann der Anwender eine Church- oder JavaScript-Zahl angeben, die Funktion findet selber heraus, welche Methode er braucht. Bei ungültigen Parametern werden die passende Fehler-Meldungen geloggt.

-&gt; [**siehe Implementation** ](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa5fce355f2e5786ee8b8948339a0b9706839253/src/stack/stack.js#L293)\*\*\*\*
{% endhint %}

{% hint style="info" %}
#### Die spezifischeren Funktionen um ein Element zu erhalten sind weiterhin vorhanden:

* **\`\`**[**`getElementByChurchNumberIndex`**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/1854cf6515e5f1ba74c48c4a9a97f12e5e363aa2/src/stack/stack.js#L319)**\`\`**
* **\`\`**[**`getElementByJsnumIndex`**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/1854cf6515e5f1ba74c48c4a9a97f12e5e363aa2/src/stack/stack.js#L332)**\`\`**

**\`\`**

#### Als Either-Variante:

*     [**`eitherElementByIndex`**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/1854cf6515e5f1ba74c48c4a9a97f12e5e363aa2/src/stack/stack.js#L270) **``**
* **\`\`**[**`eitherElementByJsNumIndex`**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/1854cf6515e5f1ba74c48c4a9a97f12e5e363aa2/src/stack/stack.js#L306)**\`\`**
* **\`\`**[**`eitherElementByChurchIndex`**](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/1854cf6515e5f1ba74c48c4a9a97f12e5e363aa2/src/stack/stack.js#L290)**\`\`**
{% endhint %}

### [removeByIndex](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L664)

Die Funktion `removeByIndex` nimmt einen Stack und eine [Church-](../forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) oder JS-Zahl als Index entgegen. Die Funktion löscht das Element am übergebenen Index und gibt den neuen Stack zurück.  
Bei einem nicht existierenden Index erhält man denselben Stack unverändert zurück.

```javascript
const stackWithStrings = convertArrayToStack( ["Hello", "Haskell", "World"] );

removeByIndex(stackWithStrings)( 2) // [ "Hello", "World" ]
removeByIndex(stackWithStrings)(n2) // [ "Hello", "World" ]

removeByIndex(stackWithStrings)(999) // [ "Hello", "Haskell", "World" ]
```

### [getIndexOfElement](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L368)

Die Funktion `getIndexOfElement` nimmt einen Stack und ein Element entgegen und gibt den Index als JavaScript-Zahl von diesem Element zurück. Wenn das Element nicht existiert wird `undefined` zurückgegeben.

```javascript
const stackWithNumbers = convertArrayToStack( [7, 34, 10] );

getIndexOfElement(stackWithNumbers)(7)    // 1
getIndexOfElement(stackWithNumbers)(34)   // 2
getIndexOfElement(stackWithNumbers)(10)   // 3
getIndexOfElement(stackWithNumbers)(100)  // undefined
```

### [maybeIndexOfElement](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L396)

Die Funktion `maybeIndexOfElement` ist analog zur Funktion [getIndexOfElement](immutable-stack-erweiterungen.md#getindexofelement). Nur der Rückgabetyp ist ein [Maybe](maybe.md).

```javascript
const stackWithNumbers = convertArrayToStack( [7, 34, 10] );

maybeIndexOfElement(stackWithNumbers)(7)    // Just(1)
maybeIndexOfElement(stackWithNumbers)(34)   // Just(2)
maybeIndexOfElement(stackWithNumbers)(10)   // Just(3)
maybeIndexOfElement(stackWithNumbers)(100)  // Nothing
```

### [containsElement](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/1854cf6515e5f1ba74c48c4a9a97f12e5e363aa2/src/stack/stack.js#L414)

Die Funktion `containsElement` nimmt einen Stack und ein Element entgegen. Gibt `True` \(ChurchBoolean\) zurück, wenn das Element im Stack vorhanden ist. Gibt `False` \(ChurchBoolean\) zurück, wenn das Element nicht im Stack vorhanden ist.

```javascript
const stackWithNumbers = convertArrayToStack( [0, 11, 22, 33] );

containsElement(stackWithNumbers)(-1) === False
containsElement(stackWithNumbers)( 0) === True
containsElement(stackWithNumbers)(11) === True
containsElement(stackWithNumbers)(22) === True
containsElement(stackWithNumbers)(33) === True
containsElement(stackWithNumbers)(44) === False
```

### [convertElementsToStack](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/aa8e41e3aff711a63a0f1ece95931753b297ca24/src/stack/stack.js#L452)

Die Funktion `convertElementsToStack` nimmt einen Rest Parameter \([JavaScript Rest Parameter](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/rest_parameters)\) entgegen. Die übergebenen Elemente werden in ein Stack umgewandelt.

```javascript
const stackWithValues = convertElementsToStack(1,2,3);

convertStackToArray( stackWithValues ) === [1,2,3]


const stackWithValues2 = convertElementsToStack(1,2,3,...['a','b','c']);

convertStackToArray( stackWithValues2 ) === [1,2,3,'a','b','c']
```

