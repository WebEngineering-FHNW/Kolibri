---
description: Stack mit Schlüssel-Wert Paare
---

# Immutable ListMap

## Beschreibung

{% hint style="info" %}
Die Titel der Funktionen sind mit einem Link zur Implementation verknüpft.
{% endhint %}

### [ListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L30)

ListMap ist eine weitere unveränderliche Datenstruktur, die auf dem Stack aufbaut. Im Kern ist die ListMap Datenstruktur gleich wie der [Stack](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md), d.h. sie ist auch als [Triple](../forschungsarbeit-ip5-lambda-kalkuel/einfache-kombinatoren.md#triple) implementiert. Der Unterschied zum Stack ist, dass in der ListMap die Einträge Schlüssel-Wert Paare sind \(wie bei einer [Java HashMap](https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html)\). Alle Werte werden in dieser Datenstruktur mit einem dazugehörigen Schlüssel abgespeichert, somit kann der Anwender einen Wert abfragen mit Hilfe des dazugehörigen Schlüssels. Alle Funktionen vom Stack sind kompatibel mit der ListMap, zusätzlich gibt es noch weitere Funktionen, die nur mit einer ListMap verwendet werden können.

```javascript
const listMap = stack; // triple
```

### [Empty-ListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L40)

Die `emptyListMap` repräsentiert die leere ListMap. Anhand dieser Konstruktion ist zu sehen, dass sie sich nur in einem Punkt zum Stack unterscheidet. Der letzte Parameter, der ListMap ist nicht nur `id`wie beim Stack, sondern ein Paar mit `id` als Schlüssel und `id` als dazugehörigen Wert.

```javascript
const emptyListMap = listMap(n0)(id)( pair(id)(id) );
```

## Verwendung

Alle Funktionen vom Stack können auch für die ListMap verwendet werden. Hier folgt die Auflistung der zusätzlichen Funktionalität, die nur mit der ListMap kompatibel ist.

{% hint style="info" %}
In den folgenden Beispielen wird zur besseren Übersicht, die ListMap Datenstruktur wie folgt dargestellt: ``**`[ (key1, value1), (key2, value2), (key3, value3), ... ]`**
{% endhint %}

{% hint style="danger" %}
Bei der Verwendung von Funktionen, des Stacks mit der ListMap muss beachtet werden, dass die Elemente immer Schlüssel-Wert Paare sind und somit immer mit einem `pair` gearbeitet wird als Eintrag.

```javascript
const listMapWithOneValue = push(emptyListMap)( pair(1)("Hello") ) // [(1, "Hello")]

const listMapWithTwoValue = push(listMapWithOneValue)( pair(42)("World") ) // [(1, "Hello"), (42, "World")]
```
{% endhint %}

### [getElementByKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L124)

Mit der `getElementByKey` Funktion kann anhand eines Schlüssels auf den dazugehörigen Wert zugegriffen werden.

```javascript
const p1 = pair(1)("Michael")
const p2 = pair(2)("Peter")
const p3 = pair(3)("Hans")

const testListMap = convertArrayToStack([p1, p2, p3]) // [ ("1", "Michael"), ("2", "Peter"),("3", "Hans") ]

getElementByKey( testListMap )( 1 )   // "Michael"
getElementByKey( testListMap )( 2 )   // "Peter"
getElementByKey( testListMap )( 3 )   // "Hans"
```

### [removeByKey](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L155)

Mit der Funktion `removeByKey` kann ein Wert anhand des Schlüssel entfernt werden.

```javascript
const p1 = pair(1)("Michael")
const p2 = pair(2)("Peter")
const p3 = pair(3)("Hans")

const testListMap   = convertArrayToStack( [p1, p2, p3] )
const resultListMap = removeByKey(testListMap)(2); // [ ("1", "Michael"), ("3", "Hans") ]

getElementByKey( resultListMap )( 1 )   // "Michael"
getElementByKey( resultListMap )( 3 )   // "Hans"
```

### [convertObjToListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L194)

Mit der Funktion `convertObjToListMap` kann ein JavaScript Objekt zu einer ListMap konvertiert werden. JavaScript-Objekte sind Container für benannte Werte, die Properties oder Methoden genannt werden. In der Konvertierungsfunktion werden die Namen als String-Schlüssel verwendet.

```javascript
// Implementation
const convertObjToListMap = obj => 
    Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);

// Anwendung
const personObject = {firstName: "George", lastName: "Lucas"}

const result = convertObjToListMap(personObject); // [ ("firstName", "George"), ("lastName","Lucas") ]

getElementByKey( result )( "firstName" )   // "George"
getElementByKey( result )( "lastName"  )   // "Lucas"
```

> #### Tuple-Konstruktor mit `convertObjToListMap` 
>
> Mit der Funktion `convertObjToListMap` kann eine Tuple-Artige Datenstruktur mit Zugriffsfunktionen erstellt werden.

> Die Funktion `personCtor` bildet den Konstruktor für das Personen Tuple.
>
> ```javascript
> // Person-Constructor
> const personCtor = fstName => lstName => age => convertObjToListMap({fstName, lstName, age});
> ```

> Die übergebenen Variablen im "Konstruktor" bilden später zusammen mit der Funktion `getElementByKey` die Zugriffsfunktionen für die Werte im Tuple.

> ```javascript
> // create Person-Tuples
> const chuck = personCtor("Chuck")("Norris")(42);
> const peter = personCtor("Peter")("Pan")(102);
>
> // accessor functions
> getElementByKey( chuck )( "fstName" )  ===  "Chuck"  
> getElementByKey( chuck )( "lstName" )  ===  "Norris" 
> getElementByKey( chuck )( "age"     )  ===  42     
>   
> getElementByKey( peter )( "fstName" )  ===  "Peter"  
> getElementByKey( peter )( "lstName" )  ===  "Pan"    
> getElementByKey( peter )( "age"     )  ===  102      
> ```

### [convertListMapToArray](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L209)

Mit der Funktion `convertListMapToArray` kann eine ListMap in ein JavaScript-Array konvertiert werden. Dabei werden nur die Werte in der ListMap erfasst.

```javascript
// Implementation
const convertListMapToArray = listMap => 
    reduceListMap(acc => curr => [...acc, curr])([])(listMap);

// Anwendung
const personObject  = {firstName: "George", lastName: "Lucas"}

const personListMap = convertListMapToArray( personObject ); // [ ("firstName", "George"), ("lastName","Lucas") ]

convertListMapToArray( personListMap ) // [ "George", "Lucas" ]
```

## Higher Order Functions \(HOF's\) speziell für ListMap

Für die ListMap wurde eine spezifischere Variante für die HOF's `map`, `filter` und `reduce`  implementiert. Dies um die Anwendung nochmals zu vereinfachen, weil sonst mit einem pair\(key\)\(value\) gearbeitet werden muss, obwohl der Anwender den Key dabei nicht benötigt bzw. verändern darf. Der Key wird in den HOF's für die ListMap weg abstrahiert, sodass sicher der Anwender auf das eigentliche Element konzentrieren kann.

### [mapListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L62)

Diese Funktion nimmt eine map-Funktion \(wie bei JavaScript Array `map`\)  und eine ListMap entgegen. Zurück gibt die Funktion eine neue ListMap mit den "gemappten" Werten.

{% hint style="info" %}
Beim Mapping des Wertes bleibt der dazugehörige Schlüssel unverändert. 
{% endhint %}

```javascript
// Implementation
const mapListMap = f => map(p => pair( p(fst) )( f(p(snd)) ));

// Anwendung
const toUpperCase      = str => str.toUpperCase();
const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans"});

const mappedListMap    = mapListMap(toUpperCase)(listMapWithNames); // [ ("name1", "PETER"), ("name2", "HANS") ]

getElementByKey( mappedListMap )( "name1" ) // "PETER"
getElementByKey( mappedListMap )( "name2" )  // "HANS"
```

### [filterListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L78)

Diese Funktion nimmt eine filter-Funktion \(wie bei JavaScript Array `filter`\) und eine ListMap __entgegen. Die Funktion gibt die gefilterte ListMap __zurück. Wenn keine Elemente dem Filter entsprechen wird die leere ListMap __\([`emptyListMap`](listmap.md#empty-listmap)\) zurückgegeben.

```javascript
// Implementation
const filterListMap    = f => filter(p => f(p(snd)));

// Anwendung
const startsWithP      = str => str.startsWith('P');

const listMapWithNames = convertObjToListMap( {name1: "Peter", name2: "Hans", name3: "Paul"} );
const filteredListMap  = filterListMap( startsWithP )( listMapWithNames ); // [ ("name1", "Peter"), ("name3", "Paul") ]

getElementByKey( filteredListMap )( "name1" );  // "Peter"
getElementByKey( filteredListMap )( "name3" );  // "Paul"
```

### [reduceListMap](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L93)

Diese Funktion nimmt als ersten Parameter eine reduce-Funktion entgegen \(wie bei JavaScript Array `reduce`\), als zweites einen Startwert und als letzten Parameter eine ListMap. Die Funktion gibt den reduzierten Wert zurück.

```javascript
// Implementation
const reduceListMap = f => reduce(acc => curr => f(acc => curr(snd)));

// Anwendung
const reduceFunc = acc => curr => acc + curr.income;

const listMapWithPersons = convertObjToListMap({
              p1: {firstName: 'Peter', income: 1000},
              p2: {firstName: 'Michael', income: 500}
        });
    
reduceListMap(reduceFunc)(0)(listMapWithPersons); // 1500
```

## Helferfunktion

### [logListMapToConsole](https://github.com/mattwolf-corporation/ip6_lambda-calculus-in-js/blob/5b1abc66ee9d06330d024f7d8769ef7c59769c85/src/listMap/listMap.js#L218)

Die Funktion `logListMapToConsole` nimmt eine ListMap entgegen und führt einen Seiteneffekt aus. Der Seiteneffekt gibt die ListMap mit dessen Schlüssel-Wert Paaren auf die JavaScript-Konsole aus.

```javascript
// Implementation
const logListMapToConsole = listMap =>
    forEach(listMap)( (element, index) => console.log("At Index " + index + " is  Key and Element " + JSON.stringify(element(fst)) + " | " + JSON.stringify(element(snd)) ));
    
// Anwendung
const listMapWithPersons = convertObjToListMap( {firstName: "George", lastName: "Lucas"} );

logListMapToConsole( listMapWithPersons );

// Logs to Console:
// Index 1 (Key, Element): ("firstName", "George")
// Index 2 (Key, Element): ("lastName", "Lucas")
```

## Enstehung der ListMap

Beim ersten Entwurf des Observables wurde für die Verwaltung der Listener die Stack Datenstruktur verwendet. Bei der Implementierung für das abmelden/entfernen der Listener wurde klar das dies mit einem Stack nicht bzw. nicht elegant gelöst werden kann. Dabei kam die Idee einer HashMap auf um einen Listener per Schlüssel abzuspeichern und wieder zu entfernen. Das Problem einer HashMap ist das dies ein gute Hash-Funktion voraussetzt und die ist ein bekanntlich schweres Problem in der Informatik. Auch für den direkten Zugriff auf eine HashMap \(in O\(1\) \) wussten wir nicht wie wir dies implementieren könnten. Da kam uns die Idee das wir eine Liste mit Schlüssel-Wert Paaren entwicklen können ohne diese zu Hashen und den Zugriff auf die Elemente mittels Iteration zum implementieren. Der Schlüssel sollte eindeutig und mit dem JavaScript === Operator auf Gleichheit verglichen werden können. Eine alternative Implementierung wäre eine Art Binär Baum, dies wäre aber sehr komplex und nicht nötig für unsere Einsatz Zwecke. Der Vorteil von unserer Implementierung ist, dass wir den bereits existierenden Stack verwenden und erweitern diesen.

