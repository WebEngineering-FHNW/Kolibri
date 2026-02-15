import { padLeft, padRight } from "../utils/strings.js";
import { Tuple }              from "../church/rock.js";

export { Suite, total }

const id = x => x;

let total = 0

const Assert = () => {
  const results = []
  return {
    results: results,
    true: (testResult) => {
      if(!testResult) { console.error('test failed') }
      results.push(testResult)
    },
    is: (actual, expected) => {
      const testResult = actual === expected
      if(!testResult) {
        console.error(`test failure. Got '${actual}', expected '${expected}'`)
      }
      results.push(testResult)
    },
    isNot: (actual, expected) => {
      const testResult = actual !== expected
      if(!testResult) {
        console.error(`test failure. Got '${actual}', expected '${expected}'`)
      }
      results.push(testResult)
    }
  }
}

const [Test, name, logic] = Tuple(2);

const test = (name, callback) => {
  const assert = Assert()
  callback(assert)
  report(name, assert.results)
}

const Suite = (suiteName) => {
  const tests = []
  const suite = {
    test: (testName, callback) => test(`${suiteName} - '${testName}'`, callback),
    add: (testName, callback) => tests.push(Test(testName)(callback)),
    run: () => {
      const suiteAssert = Assert()
      tests.forEach(test => test(logic)(suiteAssert))
      total += suiteAssert.results.length
      if(suiteAssert.results.every(id)){
        report(`suite ${suiteName}`, suiteAssert.results)
      } else {
        tests.forEach(test => suite.test(test(name), test(logic)))
      }
    }
  }
  return suite
}

const report = (origin, ok) => {
  const extend = 20
  if(ok.every(elem => elem)){
    write(` ${padLeft(ok.length, 3)} tests in ${padRight(origin, extend)} ok`)
    return
  }
  let reportLine = `Failing tests in ${padRight(origin, extend)}`
  write(`   !  ${reportLine}`)
  for(let i = 0; i < ok.length; i++){
    if(!ok[i]){
      write(`   !  Test #${padLeft(i+1, 3)} failed`)
    }
  }
}

const write = (message) => {
  const out = document.getElementById('out');
  out.innerText += message + "\n";
}