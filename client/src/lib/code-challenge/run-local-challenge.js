/* eslint-disable */
import * as Sandbox from './sandbox'
import { cleanMochaStackTrace } from './stack-traces'

// type Handlers = {
//   onUnexpectedTerminate: (reason: TerminateReason) => void
//   onRunComplete: (submittedCode: string) => void
//   onSingleTestResult: (result: TestResult) => void
// }
// type TerminateReason = 'timeout' | 'unknown'
//
//
// type Message
//   = { type: 'timeout' }
//   | { type: 'console', args: any[] }
//   | { type: 'error', error: { name: string, message: string }, trace: any }
//   | { type: 'end' }
//   | { type: '__terminate__' }
//   | TestResult
//
// export type TestResult = TestPass | TestFail
// type TestPass = { type: 'test-pass', title: string, index: number }
// type TestFail = { type: 'test-fail', title: string, index: number, message: string, stackTrace: string[] }

export async function runLocalChallenge (args) {

  var wrappedCode = wrapCode(args.code, args.spec)

  var running = true

  Sandbox.run(wrappedCode, function (sandbox, error, data) {;
    handleSandboxResult({
      submittedCode: args.code,
      handlers: {
        onSingleTestResult: args.handlers.onSingleTestResult,
        onUnexpectedTerminate: (reason) => {
          if (running === false) return;
          running = false
          args.handlers.onUnexpectedTerminate(reason)
        },
        onRunComplete: (code) => {
          running = false
          args.handlers.onRunComplete(code)
        }
      },
      data,
      error,
      sandbox,
    })
  })
}


function handleSandboxResult (args) {
  var {submittedCode, sandbox, handlers, error, data} = args
  if (error) {
    sandbox.terminate()
    handlers.onUnexpectedTerminate('unknown')
    console.log("Compiling Error: Check Your Code", error)
  }
  else if (data.type === 'test-pass' || data.type === 'test-fail') {
    handlers.onSingleTestResult(cleanResult(data))
  }
  else if (data.type === 'console') {
    console.log(...data.args)
  }
  else if (data.type === 'timeout') {
    sandbox.terminate()
    handlers.onUnexpectedTerminate('timeout')
  }
  else if (data.type === '__terminate__') {
    sandbox.terminate()
    handlers.onUnexpectedTerminate('unknown')
    console.log('Unexpected terminate', data, error)
  }
  else if (data.type === 'end') {
    sandbox.terminate()
    handlers.onRunComplete(submittedCode)
  }
  else {
    console.log('unknown message', data, error)
  }
}

//
// Minor helpers
//
function cleanResult (result) {
  if (result.type === 'test-pass') return result
  result.stackTrace = cleanMochaStackTrace(result.stackTrace, 0)
  return result
}

function findIndex (array, pred) {
  for (var i=0; i < array.length; i++) {
    if ( pred(array[i]) ) return i
  }
  return -1
}




function wrapCode (code, spec) {
  var result = `
    var expect = chai.expect;
    var console={};
    console.log = function log () {
      postMessage({ type: 'console', args: Array.prototype.slice.call(arguments) })
    };
  `.replace(/\n/g,'')
  + code
  + `
    try {
      ${spec};
      mocha.run()
    }
    catch (e) {
      postMessage({type: 'console', args: ['Well here we are.']})
      // Catch anything that is not caught by mocha
      //
      // var trace = printStackTrace({ e: e });
      // postMessage({ type: 'error', error: { name: e.name, message: e.message }, trace: trace });
    }
  `

  return result
}
