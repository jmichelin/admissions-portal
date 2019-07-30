import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';
import * as buble from 'buble'
import { CODE_CHALLENGE_ENDPOINT, CODING_CHALLENGE_TESTS, SEI_STEPS_12_WK, SEI_STEPS_18_WK, HERO_TEXT } from '../constants';
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
      errorMessage: "Test your code to see if you pass each step.  Click Submit once you've passed all steps.",
      redirectToDashboard: false,
      internalStatusUpdate: '',
      attemptSubmitted: false
    };

    this.runLocal = this.runLocal.bind(this);
    this.codeSubmit = this.codeSubmit.bind(this);
    this.codeAttemptUpdate = this.codeAttemptUpdate.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.opp) {
      const { opp } = this.props.location.state;

      if (opp.currentStep !== SEI_STEPS_12_WK.STEP_TWO && !this.props.location.override) {
        this.setState({ redirectToDashboard: true })
      }

      this.setState({ opp })
    }
  }

  prettyErrorMessage(err) {
    return err.toString().split('\n')[0];
  }

  runLocal = async (code, e) => {
    e.preventDefault();
    let results = [];
    this.setState({ showProcessing: true })

    try {
      var es5 = buble.transform(code)
    } catch (err) {
      // Simulate code running for better UX
      setTimeout(() => {
        this.setState({
          showProcessing: false,
          errorMessage: this.prettyErrorMessage(err)
        })
      }, 800)

      return;
    }

    const { runLocalChallenge } = await import('../lib/code-challenge/run-local-challenge')

    runLocalChallenge({
      code: es5.code,
      spec: CODING_CHALLENGE_TESTS,
      handlers: {
        onSingleTestResult: (result) => {
          results.push(result)
        },
        onRunComplete: async (submittedCode) => {
          const allCorrect = results && results.every(r => r.type === 'test-pass')
          const firstFailingTest = results.find(el => el.type === 'test-fail')

          this.setState({
            showProcessing: false,
            localTestResults: results,
            errorMessage: allCorrect ? "You have passed all the tests! Submit your code to move to the next step in the admissions process." : `Keep working on Step ${firstFailingTest.index < 5 ? firstFailingTest.index + 1: 6}`,
            allPassed: allCorrect ? true : false,
            submittedCode: submittedCode
          })

          this.codeAttemptUpdate();

          return submittedCode;
        },
        onUnexpectedTerminate: (reason) => {
          if (reason === 'timeout') alert("Your code timed out.")

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

  codeAttemptUpdate() {
    if (!this.state.allPassed && !this.state.attemptSubmitted) {
      const data = {
        code: this.state.submittedCode,
        oppId: this.state.opp.id,
        moveForward: 'No',
        stage: 'Sent Takehome'
      }

      fetch(CODE_CHALLENGE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'content-type': 'application/json'
        },
      })
        .then(response => {
          if (response.ok) return response.json()
          this.setState({ redirectToDashboard: true });
          throw new Error();
        })
        .then(() => { this.setState({ attemptSubmitted: true }); })
        .catch(() => { this.setState({ redirectToDashboard: true }); })
    }
  }

  codeSubmit(e) {
    e.preventDefault();

    if (this.state.allPassed && this.state.submittedCode) {
      this.setState({ submittingCode: true })

      const data = {
        code: this.state.submittedCode,
        oppId: this.state.opp.id,
        moveForward: 'Yes',
        stage: 'Returned Takehome'
      }

      fetch(CODE_CHALLENGE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'content-type': 'application/json'
        },
      })
        .then(response => {
          if (response.ok) return response.json()

          throw new Error();
        })
        .then(() => {
          const stageUpdate = this.state.opp.courseType === '18 Week Full-Time Immersive' ? SEI_STEPS_18_WK.STEP_TWO : SEI_STEPS_12_WK.STEP_THREE;
          this.props.statusUpdate(this.state.opp.id, stageUpdate)
          this.setState({ submittingCode: false, redirectToDashboard:true});
        })
        .catch(err => {
          this.setState({ errorMessage: err.message, submittingCode: false })
        })
    } else {
      this.setState({ errorMessage: 'There was an error submitting your code. Please try again.' })
    }
  }

  render() {
    if (this.state.redirectToDashboard) return <Redirect to='/dashboard'/>

    return (
      <div className="coding-challenge">
        <div className="container">
          <div className="portal-inner">
            <Hero
              headline={HERO_TEXT.CODING_CHALLENGE.heroHeadline}
              description={HERO_TEXT.CODING_CHALLENGE.heroDescription}
            />
            <Breadcrumb />
            <div className="challenge-editor">
              <CodingInstructions tests={this.state.localTestResults} allPassed={this.state.allPassed} />
              <div className="code-editor col">
                <h4 className="column-header">
                  Code Editor
                </h4>
                <CodeEditor
                  codeTest={this.runLocal}
                  codeSubmit={this.codeSubmit}
                  showSubmitButton={true}
                  mode="javascript"
                  codeAttemptUpdate={this.codeAttemptUpdate}
                  errorMessage={this.state.errorMessage}
                  allPassed={this.state.allPassed}
                  showProcessing={this.state.showProcessing}
                  submittingCode={this.state.submittingCode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CodingChallenge;
