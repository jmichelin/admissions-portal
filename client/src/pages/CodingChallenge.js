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
      errorMessage: '',
      passingTests: [],
      failingTests: []
    };

    this.runLocal = this.runLocal.bind(this);

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


  runLocal = async (code) => {
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
      code: code,
      spec: CODING_CHALLENGE_TESTS,
      handlers: {
        onSingleTestResult: (result) => {
          let results = this.state.localTestResults || [];
          let passingTests = this.state.passingTests || [];
          let failingTests = this.state.failingTests || [];
          if (result.type === 'test-pass') { passingTests.push(result.index) }
          if (result.type === 'test-fail') { failingTests.push(result.index) }

          this.setState({
            localTestResults: results.concat([result]),
            passingTests: passingTests,
            failingTests: failingTests
          })
        },
        onRunComplete: async (submittedCode) => {

          let results = this.state.localTestResults;
          let allCorrect = results && results.every(r => r.type === 'test-pass')

          this.setState({
            showProcessing: false,
            localTestResults: [],
            passingTests: [],
            failingTests: [],
            errorMessage: allCorrect ? 'Congrats! You have passed all the tests!' : `Keep working on Step ${this.state.failingTests[1]}`
          })

          // var response = await fetch('POST', this.props.submissionUrl, {
          //   body: {
          //     answer: {
          //       code: submittedCode,
          //       m: !! allCorrect // Intentionally vague
          //     },
          //     challenge_id: this.props.challenge.id,
          //   }
          // })
          // var newSubmission = response.submittedChallengeAnswer
          // var presenterArray = this.state.submissionPresenters
          //
          // presenterArray.unshift(newSubmission)
          // this.setState({ submissionPresenters: presenterArray })
          // this.afterGrade(this.props.challenge.id, newSubmission.status)
        },
        onUnexpectedTerminate: (reason) => {

          if (reason === 'timeout') {
            alert("Your code timed out")
          }
          else if (reason === 'unknown') {
            alert("Your code threw an unknown error")
          }
          this.setState({
            showProcessing: false,
            errorMessage: 'Error with your code'
          })
        },
      }
    })
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
                  <CodingInstructions/>
                  <div className="code-editor col">
                    <h4 className="column-header">Code Editor</h4>
                    <CodeEditor codeSubmit={this.runLocal} errorMessage={this.state.errorMessage}/>
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
