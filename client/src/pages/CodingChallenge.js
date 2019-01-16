import React, { Component } from 'react';

import * as buble from 'buble'

 import { CODING_CHALLENGE_TESTS } from '../constants';
import CodingInstructions from '../components/CodingInstructions';
import CodeEditor from '../components/CodeEditor';

class CodingChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
      code: '',
      localTestResults: [],
      showProcessing: false,
      allPassed: false,
      errorMessage: ''
    };

    this.runLocal = this.runLocal.bind(this);
    this.codeSubmit = this.codeSubmit.bind(this);
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({
      redirectToHome: true
    })
  }

  prettyErrorMessage(err) {
    let pretty =  err.toString().split('\n')[0];
    return pretty;
  }


  runLocal = async (code, e) => {
    e.preventDefault();
    let results = [];
    this.setState({ showProcessing: true })

    try {
      var es5 = buble.transform(code)
    }
    catch (err) {
      // Simulate code running for better UX
      setTimeout(() => {
        this.setState({
          showProcessing: false,
          errorMessage: this.prettyErrorMessage(err)
        })
      }, 800)
      return;
    }

    const {runLocalChallenge} = await import('../lib/code-challenge/run-local-challenge')

    runLocalChallenge({
      code: es5.code,
      spec: CODING_CHALLENGE_TESTS,
      handlers: {
        onSingleTestResult: (result) => {
          results.push(result)

        },
        onRunComplete: async (submittedCode) => {
          let allCorrect = results && results.every(r => r.type === 'test-pass')
          let firstFailingTest = results.find(el => el.type === 'test-fail')

          this.setState({
            showProcessing: false,
            localTestResults: results,
            errorMessage: allCorrect ? 'You have passed all the tests! Submit your code.' : `Keep working on Step ${firstFailingTest.index + 1}`,
            allPassed: allCorrect ? true : false,
            submittedCode: submittedCode
          })

          return submittedCode;
        },
        onUnexpectedTerminate: (reason) => {

          if (reason === 'timeout') {
            alert("Your code timed out.")
          }
          this.setState({
            showProcessing: false,
            errorMessage: 'Your code threw an error. Check your syntax.'
          })
          return;
        },
      }
    })
    return;

  }

  codeSubmit(e) {
    e.preventDefault();
      if (this.state.allPassed) {
        // send to salesforce

        return;
      } else {
        this.setState({
          errorMessage: 'There was an error submitting your code. Please try again.'
        })
      }
  }

  render() {
    return (
      <div className="coding-challenge">
          <div className="container">
            <div>
              <h3 className="portal-title">Admissions Portal Dashboard</h3>
              <h4 className="title-subtext">Basic JavaScript Coding Challenge</h4>
              <div className="portal-inner">
                <div className="section-header">
                  <h4>Start the Challenge</h4>
                </div>
                <p className="section-row">This quick coding challenge will test your understanding of basic JavaScript syntax and start you on your admissions journey. If you're new to programming or JavaScript, don't be deterred. Try this challenge as many times as you need - your application will not be affected by errors. Best of luck!</p>
                <div className="challenge-editor">
                  <CodingInstructions tests={this.state.localTestResults}/>
                  <div className="code-editor col">
                    <h4 className="column-header">Code Editor</h4>
                    <CodeEditor codeTest={this.runLocal} codeSubmit={this.codeSubmit} errorMessage={this.state.errorMessage} allPassed={this.state.allPassed}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default CodingChallenge;
