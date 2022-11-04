
console.log("start");

const value = [];

for (let i = 0; i < 1000; i++) {
  for (let j = 0; j < 1000; j++) {
    value.push("i");
  }


  const start = self.performance.now();
  for (let k = 0; k < 1000; k++) {
    value.push("i");
    value.shift();
  }
  const end = self.performance.now();
  self.postMessage(end-start);
}

console.log("end");
