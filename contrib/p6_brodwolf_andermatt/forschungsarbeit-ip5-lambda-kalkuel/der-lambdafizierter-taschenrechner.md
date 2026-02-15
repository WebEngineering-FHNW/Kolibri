# Der lambdafizierter Taschenrechner

## Beschreibung

Für ein Einstieg-Projekt, um sich am beste einmal mit den [Kombinatoren](einfache-kombinatoren.md) und den [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md) auseinander zusetzen, haben wir uns für einen Taschenrechner entschieden.

#### Link zum lambdafizierten Taschenrechner: [Calculator.html](https://mattwolf-corporation.github.io/lambdaCalculusGithubPages/src/calculator/calculator-view.html)

## Kern des Taschenrechner

Die Idee war einen Taschenrechner so zu bauen, der möglichst leicht zu bedienen und verständlich aufgebaut ist. Um diese Anforderungen zu erreichen sollte eine einfache Verkettung der arithmetischen Zahlen und Operationen möglich sein.

Als Helferfunktion wurde eine sogenannter _CalculatorHandler_ entwickelt, mit dem solch eine Konstruktion schlussendlich möglich ist.

CaluclatorHandler Implementation:

```javascript
const calculatorHandler = op => n => k => f => f(op(n)(k));
```

Der _calculatorHandler_ nimmt jeweils eine arithmetische Operation (Addition, Subtraktion, Multiplikation usw.), zwei Werte und zum Schluss eine Funktion entgegen.

## Rechnen mit JavaScript-Zahlen

Um mit JavaScript-Zahlen zu rechnen werden die Arithmetischen-Operatoren von JavaScript benötigt:

```javascript
const plus              = n => k => n + k;
const multiplication    = n => k => n * k;
const subtraction       = n => k => n - k;
const exponentiation    = n => k => n ** k;
const division          = n => k => n / k;

// example
plus(1)(2)            // 3
multiplication(2)(3)  // 6 
subtraction(5)(2)     // 3
```

Mit dem _CalculatorHandler_ und den JavaScript-Operatoren kombiniert, werden via Point-Freestyle neue (Calculator-)Funktionen erstellt:

```javascript
const add   = calculatorHandler(plus);            
const multi = calculatorHandler(multiplication);  
const sub   = calculatorHandler(subtraction);
const pow   = calculatorHandler(exponentiation);
const div   = calculatorHandler(division);
```

Mit der [Thrush-Funktion](einfache-kombinatoren.md) (`T = x => f => f(x)` ) als den Taschenrechner-Starter und den neuen CalculatorFunktionen, ist es mögliche eine unendliche Verkettungen von Zahlen und Operationen zu erstellen.

Beispiel:

```javascript
T(1)(add)(2)(pow)(6)(sub)(2)(div)(8)(add)(7)(multi)(4)(sub)...
```

Um dieser Verkettung ein Ende zu setzen und das Resultat der Berechnung zu erhalten, benötigt es jeglich die [Identitäts-Funktion](einfache-kombinatoren.md) als Letztes anzuwenden.

Beispiel:

```javascript
T(1)(add)(2)(id)                     //   3
T(1)(sub)(2)(id)                     //  -1
T(5)(multi)(4)(add)(2)(id)           //  22
T(5)(div)(5)(multi)(100)(add)(1)(id) // 101
```

Um die Leserlichkeit des Code zu verbessern, wird für die _Trush_- und _id_-Funktion ein passender Variablename gewählt.

Implementation (Umbenennung):

```javascript
const calc   = T;
const result = id;
```

Beispiel:

```javascript
calc(5)(multi)(4)(sub)(4)(pow)(2)(div)(8)(add)(10)(result) // 42
```

## Rechnen mit Church Encodings-Zahlen

Das der Taschenrechner nicht nur mit JavaScript-Zahlen sondern auch mit [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md) rechnen kann, braucht es nur die[ lambdafizierte Arithmetik-Operatoren mit Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md#church-addition-addieren) mit dem _CalculatorHandler_ zu kombinieren.

Implementationen:

```javascript
const churchAdd     = calculatorHandler(churchAddition);
const churchMulti   = calculatorHandler(churchMultiplication);
const churchPow     = calculatorHandler(churchPotency);
const churchSub     = calculatorHandler(churchSubtraction);
```

Mit diesen [lambdafizierte Arithmetik-Operatoren](church-encodings-zahlen-und-boolesche-werte.md) und den [Church-Zahlen](church-encodings-zahlen-und-boolesche-werte.md#church-zahlen) lässt sich der Taschenrechner gleich bequem bedienen.

Beispiel:

```javascript
calc(n5)(churchMulti)(n9)(churchAdd)(n4)(churchSub)(n7)(result) // 42
```

### Die Probleme mit den Church-Zahlen

#### Negative Zahle

Was der lambdafizierter Taschenrechner im vergleich zum JavaScript-Taschenrechner nicht kann sind mit negative Zahlen rechnen, da Church-Zahlen nur Werte der Natürlichen-Zahlen repräsentiert werden kann:

```javascript
calc(1)(sub)(7)(result)         // -6

calc(n1)(churchSub)(n7)(result) // 0 bzw. n0
```

#### Division

Gleiches Problem wie mit den negativen Zahlen, können die Church-Zahlen keine Rationale-Zahlen repräsentiere. Deswegen gibt es keinen lambdafizierten Division-Operator.

#### Maximum call stack size exceeded

Bei Berechnung mit grösseren Church-Zahlen und längerer Verkettungen kann es zu einem _Maximum call stack size exceeded_ - Error kommen:

```javascript
calc(n5)(cpow)(n8)(cmulti)(n6)(cadd)(n8)(csub)(n9) ... // Maximum call stack size exceeded
```

## Taschenrechner User-Interface

Um den lambdafizierten Taschenrechner, wie ein gewöhnter Taschenrechner auch visuell bedienen zu können, wurde eine statische HTML-Webseite, mit einem grafischen Taschenrechner und den von hier gezeigten Funktionen implementiert:

![](<../.gitbook/assets/image (10).png>)

Link zum lambdafizierten Taschenrechner: [Calculator.html](https://mattwolf-corporation.github.io/lambdaCalculusGithubPages/src/calculator/calculator-view.html)

## Eigenschaften des lambdafizierter Taschenrechner

* Alle Funktionen sind **rein**
* In allen Funktionen gibt es **keine** Ausdrücke wie _`for`_, _`while`_ oder `do` **Schleifen**.
