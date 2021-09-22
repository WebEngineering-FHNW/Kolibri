const trace = x => {
    console.log(x);
    return x;
};

const Functor = value => ({
    map: fn => Functor(fn(value)),
    val: () => value
});

const u = Functor(2);

const r1 = u;
const r2 = u.map(x => x);  //Identity(2)

//r1.map(trace); //2
console.log('--------')
// r2.map(trace); //2


const f = n => n + 1;
const g = n => n * 2;

//Compositionlaw

const r3 = u.map(x => f(g(x))); //Identity(5)
const r4 = u.map(g).map(f);         // Identity(5)

// r3.map(trace);  //5
// r4.map(trace);  //5