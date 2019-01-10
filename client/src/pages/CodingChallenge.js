import React, { Component } from 'react';

import CodingInstructions from '../components/CodingInstructions';
import CodeEditor from '../components/CodeEditor';

class CodingChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
      code: ''
    };

    this.codeSubmit = this.codeSubmit.bind(this);

  }

  logout() {
    localStorage.removeItem('token');
    this.setState({
      redirectToHome: true
    })
  }

  componentDidMount() {

  }

  codeSubmit(code) {
    console.log(code);

  }


  runLocal = async (code) => {
    const {runLocalChallenge} = await import('../lib/code-challenge/run-local-challenge')

    // this.setState({
    //   showProcessing: true,
    //   inputChanged: false,
    //   localTestResults: null,
    //   localStatus: 'processing',
    // });

    runLocalChallenge({
      code: this.state.input || '',
      spec: this.state.challenge.tests,
      handlers: {
        onSingleTestResult: (result) => {
          var results = this.state.localTestResults || []
          this.setState({ localTestResults: results.concat([result]) })
        },
        onRunComplete: async (submittedCode) => {
          var results = this.state.localTestResults
          var allCorrect = results && results.every(r => r.type === 'test-pass')
          //
          // this.setState({
          //   showProcessing: false,
          //   localStatus: allCorrect ? 'correct' : 'incorrect'
          // })

          var response = await fetch('POST', this.props.submissionUrl, {
            body: {
              answer: {
                code: submittedCode,
                m: !! allCorrect // Intentionally vague
              },
              challenge_id: this.props.challenge.id,
            }
          })
          var newSubmission = response.submittedChallengeAnswer
          var presenterArray = this.state.submissionPresenters

          presenterArray.unshift(newSubmission)
          this.setState({ submissionPresenters: presenterArray })
          this.afterGrade(this.props.challenge.id, newSubmission.status)
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
            localStatus: reason === 'timeout' ? 'timeout' : 'failed'
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
                    <CodeEditor codeSubmit={this.codeSubmit}/>
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
