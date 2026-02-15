---
description: von Benjamin Brodwolf & Pascal Andermatt
---

# Lambda Kalkül für praktisches JavaScript

![](.gitbook/assets/repoimage.png)

### Was ist Lambda Kalkül?

_Lambda Kalkül_ ist ein formales System, in der mathematische Logik zur Berechnung und Untersuchung von Funktionen gilt. Es ist ein universelles Berechnungsmodel , mit dem jede Turing-Maschine simuliert werden kann. Es wurde von dem Mathematiker [Alonzo Church](https://en.wikipedia.org/wiki/Alonzo\_Church) in den 1930er Jahren als Teil seiner Forschung zu den Grundlagen der Mathematik eingeführt.

> Lambda-Kalkül hat im Grunde nichts in sich. Es hat nur drei Dinge: Variablenbindung, einen Weg, Funktionen zu bauen und einen Weg, Funktionen anzuwenden. Es hat keine anderen Kontrollstrukturen, keine anderen Datentypen, gar nichts.

### Was ist JavaScript?

JavaScript ist die Programmiersprache die hauptsächlich im Web verwendet wird und durch den Browser ausgeführt wird. JavaScript integriert dabei viele funktionale Aspekte, stellt aber auch einiges an Funktionalität aus der objektorientierten Programmierung zur Verfügung. Es besteht also die Möglichkeit, in vielen verschiedenen Paradigmen zu programmieren.

### Lambda Kalkül & JavaScript

Das Konzept ist, Lambda Kalkül mit der Programmiersprache JavaScript zu verbinden. Das heisst, in nur rein [funktionalen Paradigma](https://de.wikipedia.org/wiki/Funktionale\_Programmierung) Program-Codes zu schreiben (purely functional). JavaScript bietet dazu Sprachelemente wie [Closures](https://developer.mozilla.org/de/docs/Web/JavaScript/Closures) und [Funktionen](https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Functions). Sie machen es möglich, dass wir in JavaScript funktional programmieren können. Es gewährleistet die Konzepte der Seiteneffektfreiheit, Zustandslosigkeit, Variablenbindung statt Zuweisung, Funktionskomposition und Funktionen höherer Ordnung (high order functions) zu schreiben.

## Forschungsarbeit

Ziel der Arbeit ist es, neue Konstruktionen aus dem untypisierten Lambda Kalkül, mit der Programmiersprache JavaScript zu bauen. Diese Konstruktionen haben das Ziel, JavaScript Applikationen robuster, sicherer und wartbarer zu machen. Bei diesen Konstruktionen setzen wir komplett auf die Werte der reinen [funktionalen Programmierung](https://de.wikipedia.org/wiki/Funktionale\_Programmierung):

* **Reinheit** (_pure functions)_: Funktionen ohne Seiteneffekte (wie mathematische Funktionen)
* **Unveränderlichkeit** (_immutable Datastructure)_: \_\_ Unveränderliche Datenstrukturen
* **Iteration**: Eine Iteration ohne Ausdrücke wie _`for`_, _`while`_ oder `do` Schleifen
* **Fehlerbehandlung** ohne `throw` Ausdruck
* **Funktionen höherer Ordnung** (high order functions).
* **Zustandslosigkeit**

> **Abgrenzung von objektorientierter Programmierung:**\
> Es werden keine objektorientierte Konzepte wie Klassen oder Vererbung usw. verwendet.

## Inhaltsverzeichnis

* [Forschungsarbeit IP5 - Lambda Kalkül mit JavaScript](https://mattwolf-corporation.gitbook.io/ip5-lambda-calculus/forschungsarbeit-ip5-lambda-kalkuel)
  * [Einfache Kombinatoren](https://mattwolf-corporation.gitbook.io/ip5-lambda-calculus/forschungsarbeit-ip5-lambda-kalkuel/einfache-kombinatoren)
  * [Church Encodings - Booleans und Zahlen](https://mattwolf-corporation.gitbook.io/ip5-lambda-calculus/forschungsarbeit-ip5-lambda-kalkuel/church-encodings-zahlen-und-boolesche-werte)
  * [Der lambdafizierter Taschenrechner](https://mattwolf-corporation.gitbook.io/ip5-lambda-calculus/forschungsarbeit-ip5-lambda-kalkuel/der-lambdafizierter-taschenrechner)
  * [Immutable Stack](https://mattwolf-corporation.gitbook.io/ip5-lambda-calculus/forschungsarbeit-ip5-lambda-kalkuel/immutable-stack)
  * [Test-Framework](https://mattwolf-corporation.gitbook.io/ip5-lambda-calculus/forschungsarbeit-ip5-lambda-kalkuel/test-framework)
* [Forschungsarbeit IP6 - Fortschrittliche Abstraktionen im Lambda Kalkül mit JavaScript](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/)
  * [Immutable ListMap](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/listmap.md)
  * [Observable](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/observable.md)
  * [Either](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/either.md)
  * [Maybe](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/maybe.md)
  * [Immutable Stack Erweiterungen](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/immutable-stack-erweiterungen.md)
  * [Box](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/box-maybebox.md)
  * [Benchmark](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/performance.md)
  * [Code Convention](forschungsarbeit-ip6-fortschrittliche-abstraktionen-im-lambda-kalkuel/design-architektur.md)

Eine Forschungsarbeit: Projekt (IP5) und Bacherlorarbeit (IP6) von

* Benjamin Brodwolf [GitHub](http://github.com/BenjaminBrodwolf)
* Pascal Andermatt [GitHub](https://github.com/PascalAndermatt)

Einen besonderes Dankschön an unseren Projektbetreuer, Auftraggeber, Supporter und Inspirator:\
[**Prof. Dierk König**](https://dierk.github.io/Home/)
