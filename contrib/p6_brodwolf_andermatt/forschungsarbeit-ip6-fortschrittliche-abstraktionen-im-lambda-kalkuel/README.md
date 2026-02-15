---
description: Die Fortsetzung.
---

# Forschungsarbeit IP6 - Fortschrittliche Abstraktionen im Lambda Kalkül

## Abstract

Ziel der Arbeit war es in JavaScript sichere und belastbare Konstruktionen mit Industriehärte zu bauen. Für den Bau dieser Konstruktionen wurden die Erkenntnisse aus dem untypsierten Lambda Kalkül angewendet. Folgende Werte waren für die Implementation der Konstruktionen essenziell:

* **Reinheit** (_pure functions)_: Funktionen ohne Seiteneffekte (wie mathematische Funktionen)
* **Unveränderlichkeit** (_immutable Datastructure)_: \_\_ Unveränderliche Datenstrukturen
* **Iteration**: Eine Iteration ohne Ausdrücke wie _`for`_, _`while`_ oder `do` Schleifen
* **Fehlerbehandlung** ohne `throw` Ausdruck
* **Funktionen höherer Ordnung** (high order functions).
* **Zustandslosigkeit**

Dabei kam eine Sammlung von folgenden Konstruktionen heraus:

* Zusätzliche Funktionen für die **immutable Stack** Datenstruktur
* Umsetzung des **Observer Pattern (funktionales Oberservable Konstrukt)**
* **Immutable ListMap** Datenstruktur (Stack mit Schlüssel-Wert Paaren)
* Umsetzung **Maybe** und **Either** Type für die Fehlerbehandlung
* **Box-Konstrukt** um Werte in einer Pipeline zu verarbeiten
* **Erweiterung des Test-Frameworks** mit einer Zeitmessung für die Methodenausführung (Benchmark-Test)
* **JsDoc** Ergänzungen (Typ Unterstützung für den Anwender)
* Dokumentation und Anwendungsbeispiele der Konstruktionen

In mehreren kleinen Beispielen hat sich gezeigt, dass die Konstruktionen den Code leserlicher, wartbarer und sicherer machen. Ausserdem entstehen weniger typische Fehler, die bei der Programmierung mit JavaScript auftreten.

## Einleitung

JavaScript hat den Ruf, eine unsichere Programmiersprache zu sein. Man kann aber auch in JavaScript sichere und belastbare Konstruktionen mit Industriehärte bauen. Ein Weg dazu ist die Anwendung von Erkenntnissen aus den Grundlagen der Informatik, dem untypisierten Lambda-Kalkül. Im Vorgänger Projekt "[Lambda Kalkül für praktisches JavaScript](../forschungsarbeit-ip5-lambda-kalkuel/)" wurde das Fundament für dieses Projekt geschaffen. Ziel dieses Projektes ist es die Konstruktionen aus dem Vorgänger Projekt zu verbessern, zu erweitern und neue zu bauen. Da es bei dieser Forschungsarbeit keine konkrete Aufgabe gibt, sondern nur ein übergeordnetes Ziel, stand folgende Frage stets im Zentrum: Wie können, zum Teil schon existierende, Lösungsansätze für bekannte Probleme in der Programmierung, mittels dem untypisierten Lambda Kalkül in JavaScript umgesetzt werden. Dabei wurde folgendes erreicht:

{% content-ref url="listmap.md" %}
[listmap.md](listmap.md)
{% endcontent-ref %}

{% content-ref url="observable.md" %}
[observable.md](observable.md)
{% endcontent-ref %}

{% content-ref url="either.md" %}
[either.md](either.md)
{% endcontent-ref %}

{% content-ref url="maybe.md" %}
[maybe.md](maybe.md)
{% endcontent-ref %}

{% content-ref url="immutable-stack-erweiterungen.md" %}
[immutable-stack-erweiterungen.md](immutable-stack-erweiterungen.md)
{% endcontent-ref %}

{% content-ref url="box-maybebox.md" %}
[box-maybebox.md](box-maybebox.md)
{% endcontent-ref %}

{% content-ref url="performance.md" %}
[performance.md](performance.md)
{% endcontent-ref %}

{% content-ref url="design-architektur.md" %}
[design-architektur.md](design-architektur.md)
{% endcontent-ref %}

Bei den entwickelten Konstruktionen wurde komplett auf die Werte der reinen [funktionalen Programmierung](https://de.wikipedia.org/wiki/Funktionale\_Programmierung) gesetzt.

* **Reinheit** (_pure functions)_: Funktionen ohne Seiteneffekte (wie mathematische Funktionen)
* **Unveränderlichkeit** (_immutable Datastructure)_: \_\_ Unveränderliche Datenstrukturen
* **Iteration**: Eine Iteration ohne Ausdrücke wie _`for`_, _`while`_ oder `do` Schleifen
* **Fehlerbehandlung** ohne `throw` Ausdruck

> **Abgrenzung von objektorientierter Programmierung:**\
> Es werden keine objektorientierte Konzepte wie Klassen oder Vererbung usw. verwendet.

Die entwickelten Konstruktionen haben das Ziel, dem Anwender einen Werkzeugkasten für das Programmieren von Webanwendungen mit JavaScript bereitzustellen. Diese Konstruktionen sollen dem Anwender helfen seine Applikationen wartbarer, robuster und sicherer zu gestalten. Dazu gibt es diverse Funktionen um von der Welt des Lambda Kalküls in die Welt von JavaScript zu wechseln und umgekehrt, wie zum Beispiel `convertArrayToStack` und `convertStackToArray`. Dies erlaubt dem Anwender die Welten zu wechseln und diese zu kombinieren.

Der Einsatz dieses Werkzeugkastens hilft Fehler zu vermeiden, die sonst typischerweise, beim Entwickeln mit JavaScript und der Verwendung von Objekten und veränderlichen Werten/Datenstrukturen, auftauchen.

### _Classic JS_ vs _Lambda JS_

#### Property Value aus Objekt extrahieren (null-safe)

**Gegeben:** Ein verschachteltes User-Objekt mit Street-Property.\
**Ziel:** Strassenname extrahieren

```javascript
// User-Object
const user = {
    firstName: "Donald",
    lastName: "Duck",
    address: {
        city: "Entenhausen",
        street: {
            name: "WaltStreet",
            nr: 10
        }
    }
}

// Anwendungs Ziel
streetName(user) // "WALTSTREET"
```

#### Eine mögliche Implementierung im klassischen JavaScript _(Classic JS)_ wäre:

```javascript
const streetName = user => {
    if (user){
        const address = user.address;
        if(address){
            const street = address.street;
            if(street){
                const name = street.name;
                if (name){
                    return name.toUpperCase();
                }
            }
        }
    }
    return "no street"
}
```

#### Eine gleichwertige Implementierung mit Verwendung des Werkzeugkastens _(Lambda JS)_:

```javascript
const streetName = user =>
    Box(maybeNotNullAndUndefined(user))
        (chainMaybe)(u => maybeNotNullAndUndefined(u.address))
        (chainMaybe)(a => maybeNotNullAndUndefined(a.street))
        (chainMaybe)(s => maybeNotNullAndUndefined(s.name))
        (foldMaybe)(n => n.toUpperCase())
    (_ => "no street")
    (id)
```

#### Vergleich

|                                   |               |             |
| --------------------------------- | ------------- | ----------- |
| Eigenschaften                     | _Classic JS_  | _Lambda JS_ |
| Variablen für Zwischenstände      | wird benötigt | keine       |
| Verschachtelung von If Statements | wird benötigt | keine       |
| Leserlichkeit/Lesefluss           | erschwert     | klarer      |
| Wartbarkeit                       | schlecht      | gut         |

### _Pure Lambda JS_ vs _Lambda JS_

Bereits eine kleine Funktion wie [`push`](../forschungsarbeit-ip5-lambda-kalkuel/immutable-stack.md#push) , die ein Stack mit einem neuen Wert erstellt , besteht im Kern aus mehreren Funktionen.

#### Die Implementation der Funktion `push` sieht wie folgt aus:

```javascript
const push = s => stack( succ( s(stackIndex) ) )(s);
```

Sie besteht aus folgenden Funktionen: `stack`, `succ`, `stackIndex` .Diese Funktionen können in der Funktion push durch ihre Implementation ersetzt werden:

`const stack = triple`

`const triple = x => y => z => f => f(x)(y)(z);`

`const succ = n => f => x => (f)(n(f)(x));`

`const stackIndex = firstOfTriple;`

`const firstOfTriple = x => y => z => x`;

#### Die Funktion `push` würde im reinen Lambda Kalkül _(pure Lambda JS)_ wie folgt aussehen:

```javascript
const push = s => (x => y => z => f => f(x)(y)(z))((n => f => x => (f)(n(f)(x)))(s(x => _ => _ => x)))(s)
```

#### Nach der Eta-Reduktion:

```javascript
const push = s => z => f => f( f => x => f( s(x => _ => _ => x)(f)(x) ))(s)(z);
```

Funktionen in JS im reinen Lambda Kalkül zu schreiben kann schnell unübersichtlich werden weil die Definitionen fehlen. Diese verschachtelten anonymen Funktion werden schnell zu komplex. Darum ist es besser dieses Funktionskonstrukt in mehreren Funktionen aufzuteilen und diesen einen sinnvollen Namen zu geben.

#### Beispiel an der grösseren Funktion `reduce`

#### Implementation von `reduce` in _Lambda JS_:

```javascript
// reduce in mehreren Funktionen unterteilt
const reduce = reduceFn => initialValue => s => {

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction    = argsTriple(secondOfTriple);
            const preAcc            = argsTriple(thirdOfTriple);
            const curr              = head(stack);
            const acc               = reduceFunction(preAcc)(curr);
            const preStack          = stack(stackPredecessor);
            return triple(preStack)(reduceFunction)(acc);
        }

        return If( hasPre(stack) )
                (Then( getTriple(argsTriple) ))
                (Else(           argsTriple  ));
    };

    const times = size(s);
    const reversedStack = times
                            (reduceIteration)
                                (triple
                                  (s)
                                  (acc => curr => push(acc)(curr))
                                  (emptyStack)
                                )
                                (thirdOfTriple);

    return times
            (reduceIteration)
                (triple
                  (reversedStack)
                  (reduceFn)
                  (initialValue)
            )(thirdOfTriple);
};
```

#### Implementation in _pure Lambda JS_ (Funktionsdefinitionen ersetzt und ETA reduziert)

```javascript
// reduce in reinem Lambda Kalkül 
const reduce = reduceFn => initialValue => s => s(x => _ => _ => x)(t => t(x => _ => _ => x)(x => _ => _ => x)(_ => (_ => y => y))(x => _ => x)(t)((t => f => f(t(x => _ => _ => x)(_ => y => _ => y))(t(_ => y => _ => y))(t(_ => y => _ => y)(t(_ => _ => z => z))((t(x => _ => _ => x))(_ => _ => z => z))))(t)))(f => f(s(x => _ => _ => x)(t => t(x => _ => _ => x)(x => _ => _ => x)(_ => (_ => y => y))(x => _ => x)(t)((t => f => f(t(x => _ => _ => x)(_ => y => _ => y))(t(_ => y => _ => y))(t(_ => y => _ => y)(t(_ => _ => z => z))((t(x => _ => _ => x))(_ => _ => z => z))))(t)))(f => f(s)(acc => curr =>  f => f( f => x => f(s(x => _ => _ => x)(f)(x)))(acc)(curr))(f => f(_ => a => a)(x => x)(x => x)))(_ => _ => z => z))(reduceFn)(initialValue))(_ => _ => z => z);
```

Die Performance leidet wenn eine grössere, komplexere Funktion in einer reinen Lambda Kalkül Schreibweise definiert ist. Da es keine Definitionen gibt die wiederverwendet werden können muss viel mehr evaluiert werden in JavaScript. Darum ist es für die Performance und für die Leserlichkeit besser die Funktionen nicht in der reinen Lambda Kalkül Schreibweise zu definieren.

## Fazit / Erkenntnisse

#### Konzepte aus der funktionalen Programmierung

Die Konstruktionen beinhalten Ideen und Konzepte aus der funktionalen Programmierung. Mit dem Einsatz dieser Konstruktionen, können JavaScript Applikationen funktionaler implementiert werden. Die Konstruktionen sind so implementiert, dass sie leicht integrierbar und anwendbar sind. Ein JavaScript Programm muss dabei nicht komplett nur aus diesen Konstruktionen bestehen, sondern der Anwender kann hier und dort bestimme Konstrukte in sein Programm einfliessen lassen.

#### Nutzen & Vorteile

In mehreren kleinen Beispielen hat sich gezeigt, dass die Konstruktionen den Code leserlicher, wartbarer und sicherer machen. Ausserdem entstehen weniger typische Fehler, die bei der Programmierung mit JavaScript auftreten.

Da die Konstruktionen aus puren Funktionen bestehen, ist der Programmablauf klarer und Fehler können besser eingegrenzt werden. Bei veränderlichen Daten und Funktionen mit Seiteneffekten, leidet die Übersicht, man verliert die Kontrolle über den Programmablauf und den Abhängigkeiten innerhalb des Programmes. Schon durch einen kleinen Einsatz von diesen Konstruktionen wird diesem Problem entgegenwirkt und die Übersicht wird verbessert.

#### JS Doc Unterstützung - Fehlendes Typ System bei JavaScript

Ein wesentliches Ziel von Typisierung in Programmiersprachen ist die **Vermeidung von Laufzeitfehlern.** JavaScript ist eine _schwach typisierte_ oder _dynamische_ Programmiersprache. Datentypen werden bei einer Variable nicht explizit deklariert und jede Variable kann mit Werten jedes Typen initialisiert werden. Es gibt auch kein Compiler der die Typen überprüfen würde. Die JS Doc unterstützt den Anwender für die korrekte Verwendung der Funktionen. Mit der JS Doc bekommt der Anwender Hinweise auf die korrekten Typ-Parameter.

**‌‌Potenzielle Erweiterungen/Vorschläge für nächste Schritte**

* Für die unveränderlichen Datenstrukturen **Stack** und **ListMap** könnten zusätzliche Funktionen entwickelt werden, sodass ein noch grösseres Anwendungsgebiet entsteht.
* Mögliche Funktionen: findFirst, stream-artige Funktionen
* Weitere Konzepte der funktionalen Programmierung umsetzen

**Was kann verbessert werden?**

* Bei gewissen Funktionen könnte noch mehr Sicherheit eingebaut werden, sodass ungültige Parameter besser abgefangen werden
* Noch mehr Funktionen die auch ein Maybe/Either Type zurückgeben
* Mehr Funktionen mit aussagekräftigen Fehlermeldungen für den Verwender

**Was wurde erreicht - Zusammenfassung**

Eine Bibliothek von Konstruktionen aus der funktionalen Programmierung (Lambda Kalkül) bestehend aus:

* Funktionale Art für die Fehlerbehandlung mit Maybe und Either Type
* Immutable Datenstruktur ListMap
* Observable
* diverse Erweiterungen für die immutable Datenstruktur Stack
* Box/Maybe-Box Pipeline Konstrukt (Funktor, Applicative, Monade)
