---
description: Wie alles begann.
---

# Forschungsarbeit IP5 - Lambda Kalkül

## Ausgangslage

Da es bei dieser Forschungsarbeit keine konkrete Aufgabe gibt, sondern nur ein übergeordnetes Ziel, haben wir uns eigene Aufgaben überlegt. Folgendes kam dabei raus:

1. Als erstes wurde eine eigene kleine Bibliothek von Lambda-Kalkül-Konstruktionen zusammengestellt ([Einfache Kombinatoren](einfache-kombinatoren.md)). Die Bibliothek wurde mit eigenen Kreationen ergänzt, um diese später in weiteren grösseren Konstruktionen zu verwenden. Diese Bibliothek dient als Werkzeugkasten und ist somit das Fundament unserer Forschungsarbeit.

Wie zum Beispiel die _Identitätsfunktion_ :

```javascript
   const id = x => x;
```

1. Einen Taschenrechner welcher nur aus Lambda-Kalkül-Konstruktionen gebaut wurde. Der Taschenrechner kann mit JavaScript- und mit [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) Berechnungen ausführen ([Der lambdafizierter Taschenrechner](der-lambdafizierter-taschenrechner.md)). Die Church-Zahlen gehören auch zum Fundament der Forschungsarbeit und dienen später dazu, Iterationen durchzuführen.
2. Als weitere Herausforderung wollten wir eine unveränderliche Datenstruktur erstellen. Dabei wurde nach eine einfachen Datenstruktur gesucht, auf welcher weitere Datenstrukturen gebaut werden können. Dabei entstand der [Immutable Stack](immutable-stack.md). Das Ziel dieser unveränderlichen Datenstruktur ist, dass bei der Verarbeitung der Daten keine Fehler, die durch Seiteneffekte von anderen Funktionen, enstehen können.
3. Zum Testen von unseren Konstruktionen wurde ein eigenes [Test-Framework ](test-framework.md)implementiert. Es dienst als Qualitätssicherung (Überprüfung der Funktionalität) und ist eine fortlaufende Unterstützung beim Refactoring der Konstruktionen.

## Was wurde erreicht

Es wurde eine Bibliothek, bestehend aus rein funktionalen Konstruktionen, angelehnt an das Lambda Kalkül, mit JavaScript erstellt. Diese Konstruktionen haben die Eigenschaft, dass sie robust und sicher sind. Die Bibliothek ist umfänglich mit JSDoc dokumentiert und kann in beliebigen JavaScript-Projekten verwendet werden.

Beispiel JSDoc-Dokumentation der Blackbird Funktion

![JSDoc für Blackbird](<../.gitbook/assets/blackbird (1).PNG>)

![IDE-Dokumentation](../.gitbook/assets/blackbirddokuhelp.PNG)

Diese zusätzliche JSDoc-Integration gibt dem Entwickler in der IDE direkt Parameter-Hinweise beim Programmieren und allgemeine Informationshinweise über die Funktionen.

Mit diesem Forschungsprojekt wurde eine solide Grundlage für weitere/zukünftige Forschung auf diesem Gebiet gelegt.

## Fazit

Unsere Konstruktionen aus dem Lambda Kalkül bringen folgende Vorteile mit sich:

* Die Verwendung von unveränderlichen Datenstrukturen reduziert Fehler im Code, in dem sie geschützt ist vor Manipulation.
* Reine Funktionen sind wartbarer und erhöhen die Leserlichkeit von Code.
* Die funktionalen Konstruktionen sind einfach zu Testen.
* Funktions-Komposition ist ein sehr mächtiges Werkzeug, weil dadurch rasch nützliche neue Konstruktionen entstehen.
