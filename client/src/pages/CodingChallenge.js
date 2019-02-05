import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import Hero from '../components/hero';

import * as buble from 'buble'

 import { CODING_CHALLENGE_TESTS, SEI_STEPS, HERO_TEXT } from '../constants';
import CodingInstructions from '../components/CodingInstructions';
import CodeEditor from '../components/CodeEditor';

class CodingChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
      opp: {},
      code: '',
      localTestResults: [],
      showProcessing: false,
      submittingCode: false,
      allPassed: false,
      errorMessage: '',
      redirectToDashboard: false,
      internalStatusUpdate: ''
    };

    this.runLocal = this.runLocal.bind(this);
    this.codeSubmit = this.codeSubmit.bind(this);
  }

  componentWillMount() {
    if (this.props.location.state && this.props.location.state.opp) {
      const {opp} = this.props.location.state;
      if (opp.currentStep !== SEI_STEPS.STEP_TWO) {
        this.setState({ redirectToDashboard: true })
      }
      this.setState({opp: opp})
    } else {
      this.setState({ redirectToDashboard: true })
    }
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
            errorMessage: allCorrect ? "You have passed all the tests! Submit your code to move to the next step in the admissions process." : `Keep working on Step ${firstFailingTest.index + 1}`,
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
    let CODE_CHALLENGE_ENDPOINT = '/api/v1/user/code-submit';
    e.preventDefault();
      if (this.state.allPassed && this.state.submittedCode) {
        this.setState({
          submittingCode: true
        })
        let data = {
          code: this.state.submittedCode,
          oppId: this.state.opp.id
        }
        fetch(CODE_CHALLENGE_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            'content-type': 'application/json'
          },
        }).then(response => {
          if (response.ok) {
            return response.json()
          }
          return response.json().then(error => {
            throw new Error(error.message)
          })
        }).then(result => {
          this.props.statusUpdate(this.state.opp.id, SEI_STEPS.STEP_THREE)
          this.setState({ submittingCode: false, redirectToDashboard:true});
        }).catch(err => {
            this.setState({
              errorMessage: err.message, submittingCode: false
            })
        })
      } else {
        this.setState({
          errorMessage: 'There was an error submitting your code. Please try again.'
        })
      }
  }

  render() {
    if (this.state.redirectToDashboard) {
      return (<Redirect to='/dashboard'/>)
    }
    return (
      <div className="coding-challenge">
          <div className="container">
              <Link to="/dashboard"><button className="-inline">Back to Dashboard</button></Link>
              <div className="portal-inner">
                <Hero headline={HERO_TEXT.CODING_CHALLENGE.heroHeadline} description={HERO_TEXT.CODING_CHALLENGE.heroDescription}/>
                <div className="challenge-editor">
                  <CodingInstructions tests={this.state.localTestResults}/>
                  <div className="code-editor col">
                    <h4 className="column-header">Code Editor</h4>
                    <CodeEditor codeTest={this.runLocal}
                      codeSubmit={this.codeSubmit}
                      errorMessage={this.state.errorMessage}
                      allPassed={this.state.allPassed}
                      showProcessing={this.state.showProcessing} 
                      submittingCode={this.state.submittingCode}/>
                  </div>
                </div>
            </div>
          </div>
      </div>
    )
  }
}

export default CodingChallenge;
