# Church Encodings - Booleans und Zahlen

## Beschreibung

Nebst den bekannten [Lambda-Kombinatoren](einfache-kombinatoren.md) gibt es noch die Church-Booleans und Church-Zahlen. Mit den Church-Booleans werden boolesche Logik mit Funktionen ausgedrückt und die Church-Zahlen sind die bekannteste Form, mit welche die natürlichen Zahlen repräsentiert werden. Benannt sind sie nach [Alonzo Church](https://de.wikipedia.org/wiki/Alonzo\_Church), Mathematiker und einer der Begründer der theoretischen Informatik.

## Church-Boolean

### True & False

_True_ kann durch die Funktion [Kestrel](einfache-kombinatoren.md#kestrel-die-konstante-funktion) ausgedrückt werden. _False_ kann durch die Funktion [Kite](einfache-kombinatoren.md#kite) ausgedrückt werden.

Implementation

```javascript
const True  = K;
const False = KI;
```

###

### Not

Der boolesche _not_ Operator kann mit der Funktion [Cardinal](einfache-kombinatoren.md#cardinal-flip-vertauschungsfunktion) ausgedrückt werden.

Implementation & Beispiele:

```javascript
const not = C;

not(True);         // False (Function)
not(False);        // True  (Function)
not(not(True));    // True  (Function)
```

### And

Die _And_-Funktion nimmt zwei Church-Booleans entgegen und liefert ein Church-Boolean zurück. Die Funktion funktioniert genau gleich wie der and-Operator in der mathematischen Logik.

Implementation:

```javascript
const and = p => q => p(q)(False);
```

Beispiele:

```javascript
and(True)(True)         // True
and(False)(True)        // False
and(True)(False)        // False
and(False)(False)       // False
```

###

### Or

Die _Or_-Funktion nimmt zwei Church-Booleans entgegen und liefert ein Church-Boolean zurück. Die Funktion funktioniert genau gleich wie der or-Operator in der mathematischen Logik.

Implementation:

```javascript
const or = p => q => p(True)(q);
```

Beispiele:

```javascript
or(True)(True)         // True
or(False)(True)        // True
or(True)(False)        // True
or(False)(False)       // False
```

###

### Boolean Equality

Diese Funktion nimmt zwei Church-Booleans entgegen und vergleicht diese miteinander. Nur wenn beide gleich sind, gibt die Funktion ein Church-True zurück, sonst ein Church-False.

Implementation:

```javascript
const beq = p => q => p(q)(not(q));
```

Beispiele:

```javascript
beq(True)(True)         // True
beq(False)(True)        // False
beq(True)(False)        // False
beq(False)(False)       // True
```

###

### Show Boolean

Die Funktion _showBoolean_ ist eine Helferfunktion um eine String Repräsentation, eines [Church-Boolean](church-encodings-zahlen-und-boolesche-werte.md#church-boolean) zu erhalten. Die Funktion nimmt ein Church-Boolean entgegen und gibt die String Repräsentation davon zurück.

Implementation:

```javascript
const showBoolean = b => b("True")("False");
```

Beispiele:

```javascript
showBoolean(True);        // 'True'
showBoolean(False);       // 'False'
```

###

### Connvert to js Bool

Die Funktion _convertToJsBool_ nimmt ein Church-Boolean entgegen und liefert die JavaScript Representation davon zurück.

Implementation:

```javascript
const convertToJsBool = b => b(true)(false);
```

Beispiele:

```javascript
convertToJsBool(True)        // true
convertToJsBool(False)       // false
```

## Church-Zahlen

Die Church-Zahlen sind keine "echte" Zahlen, sondern eine Funktionen wird n-Mal auf ein Argument angewendet. Um die Zahl Eins als eine Church-Zahl ( **`n1`**) zu repräsentieren muss es eine Funktion geben die einmal auf das Argument angewendet wird.

Implementation der Church-Zahl **`n1`** (Eins):

```javascript
// Implementation n1
const n1 = f => a => f(a);

// Demonstration
n1(x => x + 1)(0)      // 1

n1(x => x + '!')('λ')  // 'λ!'
```

Das gleiche mit den Zahlen von Zwei bis Neun, welche jeweils n-Mal auf ein Argument angewendet werden.

```javascript
// Implementation n2...n9
const n2 = f => a => f(f(a));
const n3 = f => a => f(f(f(a)));
const n4 = f => a => f(f(f(f(a))));
const n5 = f => a => f(f(f(f(f(a)))));
const n6 = f => a => f(f(f(f(f(f(a))))));
const n7 = f => a => f(f(f(f(f(f(f(a)))))));
const n8 = f => a => f(f(f(f(f(f(f(f(a))))))));
const n9 = f => a => f(f(f(f(f(f(f(f(f(a)))))))));

// Demonstration
n2(x => x + 1)(0)      // 2
n3(x => x + 1)(0)      // 3
n4(x => x + 1)(0)      // 4

n3(x => x + '!')('λ')  // 'λ!!!'
```

[\
](https://app.gitbook.com/o/-LxvX5wRt4iZQYQCO91m/s/-LxvT4FjUzC3S6o979vv/)Die Zahl Null **`n0`** wird in den Church-Zahlen als Funktion die keinmal auf das Argument angewendet wird. Somit wird die Funktion `f` ignoriert.

Implementation der Church-Zahl **`n0`** (Null):

```javascript
// Implementation n0
const n0 = f => a => a;

// Demonstration
n0(x => x + 1)(0)      // 0

n0(x => x + '!')('λ')  // 'λ'
```

{% hint style="info" %}
`n0` nimmt zwei Parameter und gibt den zweiten zurück. Gleich wie die Funktion: [Kite](einfache-kombinatoren.md#kite) (`n0 === KI`).
{% endhint %}

### jsNum

Um eine Church-Zahl in eine JavaScript-Zahl zu transferiere, evaluiert die Funktion `jsNum` die Church-Zahl n-Mal den Funktionsaufruf und zählt dabei die Aufrufe.

```javascript
// Implementaion
const jsNum = n => n(x => x + 1)(0);

// Anwendung
jsNum(n0)     // 0
jsNum(n1)     // 1
jsNum(n2)     // 2
```

### churchNum

Um aus einer JavaScript-Zahl eine Church-Zahl zu kreieren, wird mit der Funktion `churchNum` rekursiv n-Mal mit der Nachfolger-Funktion [`successor`](church-encodings-zahlen-und-boolesche-werte.md#successor-nachfolger) eine Church-Zahl gebaut.

```javascript
// Implementaion
const churchNum = n => n === 0 ? n0 : successor(churchNum(n - 1));

// Anwendung
jsNum(0)     // n0
jsNum(1)     // n1
jsNum(2)     // n2
```

## Mathematische Operationen mit Church-Zahlen

### Successor (Nachfolger)

Der _Successor_ nimmt eine Church-Zahl und gibt dessen Nachfolger zurück.

Implementation:

```javascript
const successor = n => f => a => f(n(f)(a));
```

Beispiel:

```javascript
successor(n0)        // n1
successor(n5)        // n6
```

###

### Phi (-Kombinator)

Der _Phi-Kombinator_ nimmt eine [Pair ](einfache-kombinatoren.md#pair)und gibt ein neues Pair zurück. Der erste Wert entspricht dem zweiten des alten Pairs. Der zweite Wert ist der Nachfolger des zweiten Wertes vom alten Pair.

Implementation:

```javascript
const phi = p => pair(p(snd))(succ(p(snd)));
```

Beispiel:

```javascript
const testPair  = pair(n1)(n2);
const testPhi   = phi(testPair);

testPhiPair(fst)    // n2
testPhiPair(snd)    // n3
```

### Predecessor (Vorgänger)

Der _Predecessor_ nimmt eine Church-Zahl und gibt dessen Vorgänger zurück.

{% hint style="info" %}
Der [Phi-Kombinator](church-encodings-zahlen-und-boolesche-werte.md#phi) ist dabei eine unterstützende Funktion um den Vorgänger der Church-Zahl zu definieren.
{% endhint %}

Implementation:

```javascript
const pred = n => n(phi)(pair(n0)(n0))(fst);
```

Beispiel:

```javascript
 pred(n0)   // n0
 pred(n1)   // n0
 pred(n2)   // n1
 pred(n9)   // n8
```

### Church-Addition (Addieren)

_ChurchAddition_ nimmt zwei Church-Zahlen und gibt den addierten Wert als Church-Zahl zurück.

{% hint style="info" %}
Der [Successor ](church-encodings-zahlen-und-boolesche-werte.md#successor)ist dabei unterstützende Funktion. Die erste Church-Zahl ruft dabei n-Mal den `successor`auf und nimmt die zweite Church-Zahl als Summand.
{% endhint %}

Implementation:

```javascript
const churchAddition = n => k => n(successor)(k);
```

Beispiel:

```javascript
churchAddition(n0)(n0)     //  0
churchAddition(n1)(n0)     //  1
churchAddition(n2)(n5)     //  7
churchAddition(n9)(n9)     // 18
```

### Church-Substraction (Substrahieren)

_ChurchSubstraction_ nimmt zwei Church-Zahlen und gibt den subtrahierten Wert als Church-Zahl zurück.

{% hint style="info" %}
Der [Predecessor ](church-encodings-zahlen-und-boolesche-werte.md#predecessor)ist dabei eine unterstützende Funktion. Die zweite Church-Zahl ruft dabei n-Mal den `pred` als Subtrahend und nimmt die erste Church-Zahl als Minuend.
{% endhint %}

Implementation:

```javascript
const churchSubtraction = n => k => k(pred)(n);
```

Beispiel:

```javascript
churchSubtraction(n2)(n1)     // 1
churchSubtraction(n2)(n0)     // 2
churchSubtraction(n2)(n5)     // 0
churchSubtraction(n9)(n4)     // 5
```

### Church-Multiplication (Multiplizieren)

_ChurchMultiplication_ nimmt zwei Church-Zahlen und gibt den multiplizierten Wert als Church-Zahl zurück.

{% hint style="info" %}
Die _ChurchMultiplication_ entspricht exakt dem [Bluebird ](einfache-kombinatoren.md#bluebird-funktionskomposition)!
{% endhint %}

Implementation:

```javascript
const churchMultiplication = B;    // Bluebird
```

Beispiel:

```javascript
churchMultiplication(n2)(n1)     //  1
churchMultiplication(n2)(n0)     //  0
churchMultiplication(n2)(n5)     // 10
churchMultiplication(n9)(n4)     // 36
```

### Church-Potency (Potenzieren)

_ChurchPotency_ nimmt zwei Church-Zahlen und gibt den potenzierende Wert als Church-Zahl zurück.

{% hint style="info" %}
Die _ChurchPotency_ entspricht exakt dem [Thrush](einfache-kombinatoren.md#trush) !
{% endhint %}

Implementation:

```javascript
const churchPotency = T;    // Thrush
```

Beispiel:

```javascript
churchPotency(n2)(n1)     //    2
churchPotency(n2)(n0)     //    1
churchPotency(n2)(n5)     //   32
churchPotency(n9)(n4)     // 6561
```

### isZero

_isZero_ nimmt eine Church-Zahlen und gibt ein [Church-Boolean](einfache-kombinatoren.md#church-boolean) zurück. Wenn die Church-Zahl `n0` ist gibt die Funktion ein Church-Boolean `True`, ansonsten `False` zurück.

{% hint style="info" %}
Beachte den [Kestrel ](einfache-kombinatoren.md#kestrel-die-konstante-funktion)`k` in der Funktion, der nur zum Zug kommt, wenn die Church-Zahl nicht `n0` ist und somit den ersten Wert bzw. `False` zurück gibt.
{% endhint %}

Implementation:

```javascript
const is0 = n => n(K(False))(True);
```

Beispiel:

```javascript
is0(n0)     // True
is0(n1)     // False
is0(n2)     // False
is0(n7)     // False
```

### leq (less-than-or-equal)

_leq_ nimmt zwei Church-Zahlen und gibt ein [Church-Boolean](einfache-kombinatoren.md#church-boolean) zurück. Wenn der erste Wert kleiner oder gleich dem zweiten Wert ist gibt die Funktion ein Church-Boolean `True`, ansonsten `False` zurück.

{% hint style="info" %}
[isZero ](church-encodings-zahlen-und-boolesche-werte.md#iszero)und [churchSubstraction ](church-encodings-zahlen-und-boolesche-werte.md#church-substraction-substrahieren)sind dabei die benötigten Funktionen um _Leq_ zu implementieren.\
_churchSubstraction_ substrahiert die erste Church-Zahl mit der zweiten Church-Zahl. Der substrahierte Wert ist `n0` , wenn die zweite Church-Zahl grösser oder gleich der ersten Church-Zahl ist. Wenn dies stimmt, gibt _isZero_ ein `True` zurück.
{% endhint %}

Implementation:

```javascript
const leq = n => k => is0(churchSubtraction(n)(k));
```

Beispiel:

```javascript
leq(n0)(n0)     // True
leq(n0)(n3)     // True
leq(n5)(n5)     // True
leq(n5)(n1)     // False
```

### eq (equality-to)

_eq_ nimmt zwei Church-Zahlen und gibt ein [Church-Boolean](einfache-kombinatoren.md#church-boolean) zurück. Wenn die beiden Church-Zahlen gleich sind, gibt die Funktion das Church-Boolean `True`, ansonsten `False` zurück.

{% hint style="info" %}
[And ](einfache-kombinatoren.md#and)und [Leq ](church-encodings-zahlen-und-boolesche-werte.md#leq-less-than-or-equal)sind dabei die unterstützende Funktionen. Mit a\_nd\_ und _leq_ werden die Church-Zahlen auf ihre Äquivalenz geprüft. Wenn dies Stimmt, erhält a\_nd\_ zwei `True`-Werte von _leq_ zurück.
{% endhint %}

Implementation:

```javascript
const eq = n => k => and(leq(n)(k))(leq(k)(n));
```

Beispiel:

```javascript
 eq(n0)(n0)  // True
 eq(n0)(n1)  // False
 eq(n1)(n1)  // True
 eq(n2)(n1)  // False
```

### gt (greater-than)

_gt_ nimmt zwei Church-Zahlen und gibt ein [Church-Boolean](einfache-kombinatoren.md#church-boolean) zurück. Wenn der erste Wert grösser als der zweite Wert ist, gibt die Funktion ein Church-Boolean `True`, ansonsten `False` zurück.

{% hint style="info" %}
[Blackbird](einfache-kombinatoren.md#blackbird), [Not ](einfache-kombinatoren.md#not)und [Leq ](church-encodings-zahlen-und-boolesche-werte.md#leq-less-than-or-equal)sind dabei die unterstützende Funktionen. Der _Blackbird_ handelt die _not_ und _leq_-Funktion (`not(leq(n)(k)` ). Dabei wird nichts andere als der Output bzw. die Church-Boolean der _leq_-Funktion von der _not_-Funktion negiert.
{% endhint %}

Implementation:

```javascript
const gt = Blackbird(not)(leq);
```

Beispiel:

```javascript
gt(n0)(n0)     // False
gt(n0)(n1)     // False
gt(n1)(n1)     // False
gt(n2)(n1)     // True 
```

###
