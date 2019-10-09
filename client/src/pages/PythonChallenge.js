import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';

import {
  PYTHON_CODE_SUBMIT_ENDPOINT,
  PYTHON_CHALLENGE_ENDPOINT,
  SUPPORT_ERROR_MESSAGE,
  DSI_STEPS,
  HERO_TEXT
} from '../constants';
import { SNIPPET_3, SNIPPET_4 } from '../constants';
import CodeEditor from '../components/CodeEditor';

class PythonChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
      opp: {},
      code: '',
      showProcessing: false,
      allPassed: false,
      submittingCode: false,
      errorMessage: "",
      submitErrorMessage: "",
      redirectToDashboard: false,
      attemptSubmitted: false,
      runningTestId: null,
      userChallenges: [],
      ch1Status: "",
      ch2Status: "",
      ch1TestResults: "",
      ch2TestResults: "",
      snippet1Placeholder: SNIPPET_3.placeholder,
      snippet2Placeholder: SNIPPET_4.placeholder
    };

    this.codeSubmit = this.codeSubmit.bind(this);
    this.testCode = this.testCode.bind(this);
    this.pollForChallenge = this.pollForChallenge.bind(this)
    this.cancelRunningChallenge = this.cancelRunningChallenge.bind(this)
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.opp) {
      const {opp} = this.props.location.state;
      if (opp.currentStep !== DSI_STEPS.STEP_TWO && !this.props.location.override) {
        this.setState({ redirectToDashboard: true })
      }
      this.setState({opp: opp})

      fetch(`${PYTHON_CHALLENGE_ENDPOINT}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'content-type': 'application/json'
        },
      }).then(response => {
        if (response.ok) {
          return response.json().then((data) => {
            let snippet1Placeholder = SNIPPET_3.placeholder
            let snippet2Placeholder = SNIPPET_4.placeholder
            let ch1Status = ""
            let ch2Status = ""
            let allPassed = false
            for(var i = 0;i < data.length; i++) {
              if (data[i].snippet_id === 3) {
                snippet1Placeholder = data[i].answer
                if (data[i].status === "correct"){
                  ch1Status = data[i].status.charAt(0).toUpperCase() + data[i].status.slice(1)
                }
              } else if (data[i].snippet_id === 4) {
                snippet2Placeholder = data[i].answer
                if (data[i].status === "correct"){
                  ch2Status = data[i].status.charAt(0).toUpperCase() + data[i].status.slice(1)
                }
              }
            }
            if (ch1Status === "Correct" && ch2Status === "Correct") allPassed = true
            this.setState({
              userChallenges: data,
              snippet1Placeholder: snippet1Placeholder,
              snippet2Placeholder: snippet2Placeholder,
              ch1Status: ch1Status,
              ch2Status: ch2Status,
              allPassed: allPassed
            })
          })
        }
        return response.json().then(error => {
          throw new Error()
        })
      })
      .catch(err => {
        this.setState({ errorMessage: SUPPORT_ERROR_MESSAGE });
      })
    } else {
      this.setState({ redirectToDashboard: true })
    }
  }

  testCode(code, e, snippetId) {
    this.setState({ errorMessage: '' });

    let data = {
      answer: code,
      snippet_id: snippetId,
      oppId: this.state.opp.id,
      moveForward: 'No',
      stage: 'Sent Takehome'
    }
    fetch(PYTHON_CHALLENGE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        'content-type': 'application/json'
      },
    }).then(response => {
      if (response.ok) {
        return response.json().then((data) => {
          this.setState({ showProcessing: true, runningTestId: data.id });
          this.pollForChallenge(data.id);
        })
      }
      return response.json().then(error => {
        throw new Error(error.message)
      })

    }).then(result => {
      this.setState({ attemptSubmitted: true });
    })
    .catch(err => {
      this.setState({ errorMessage: err.message || SUPPORT_ERROR_MESSAGE });
    })
  }

  pollForChallenge(id) {
    fetch(`${PYTHON_CHALLENGE_ENDPOINT}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        'content-type': 'application/json'
      },
    }).then(response => {
      if (response.ok) {
        return response.json().then((data) => {
          if (data.status === "processing") {
            setTimeout(()=>{
              this.pollForChallenge(data.id)
            }, 1000)
          } else {
            let status
            if (data.status === "incorrect") {
              status = "Err, try again…"
            } else {
              status = data.status.charAt(0).toUpperCase() + data.status.slice(1)
            }
            let allPassed = false
            if (data.snippet_id === 3) {
              if (status === "Correct" && this.state.ch2Status === "Correct") allPassed = true
              this.setState({
                showProcessing: false,
                runningTestId: null,
                ch1Status: status,
                allPassed: allPassed,
                ch1TestResults: data.test_results
              });
            } else {
              if (status === "Correct" && this.state.ch1Status === "Correct") allPassed = true
              this.setState({
                showProcessing: false,
                runningTestId: null,
                ch2Status: status,
                allPassed: allPassed,
                ch2TestResults: data.test_results
              });
            }
          }
        })
      }
      return response.json().then(error => {
        throw new Error()
      })
    })
    .catch(err => {
      this.setState({ errorMessage: SUPPORT_ERROR_MESSAGE });
    })
  }

  cancelRunningChallenge() {
    let id = this.state.runningTestId
    fetch(`${PYTHON_CHALLENGE_ENDPOINT}/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        'content-type': 'application/json'
      },
    }).then(response => {
      if (response.ok) {
        return response.json().then((data) => {
        })
      }
      return response.json().then(error => {
        throw new Error()
      })
    })
    .catch(err => {
      this.setState({ errorMessage: SUPPORT_ERROR_MESSAGE });
    })
  }

  codeSubmit(e) {
    e.preventDefault();
    if (this.state.allPassed) {
      this.setState({ submittingCode: true })
      let data = {
        code: this.state.submittedCode,
        oppId: this.state.opp.id,
        moveForward: 'Yes',
        stage: 'Returned Takehome',
        pythonScore: 3
      }
      fetch(PYTHON_CODE_SUBMIT_ENDPOINT, {
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
        let stageUpdate = DSI_STEPS.STEP_THREE;
        this.props.statusUpdate(this.state.opp.id, stageUpdate)
        this.setState({ submittingCode: false});
        return this.props.history.push({
        pathname: `/dashboard`,
        search: `?conv=takehome_complete&prod=dsi`,
        })
      }).catch(err => {

        this.setState({
          submitErrorMessage: err.message, submittingCode: false
        })
      })
    } else {
      this.setState({
        submitErrorMessage: 'There was an error submitting your code. Please try again.'
      })
    }
  }

  render() {
    if (this.state.redirectToDashboard) {
      return (<Redirect to='/dashboard'/>)
    }

    let ch1TestResults
    if (this.state.ch1TestResults !== "") {
      ch1TestResults = (<div className="ch-test-results">
        <h6>Test Results</h6>
        <pre>
          <span dangerouslySetInnerHTML={{ __html: this.state.ch1TestResults }} />
        </pre>
      </div>)
    }
    let ch2TestResults
    if (this.state.ch2TestResults !== "") {
      ch2TestResults = (<div className="ch-test-results">
        <h6>Test Results</h6>
        <pre>
          <span dangerouslySetInnerHTML={{ __html: this.state.ch2TestResults }} />
        </pre>
      </div>)
    }
    return (
      <div className="coding-challenge">
        <div className="container">
          <div className="portal-inner">
            <Hero
              headline={HERO_TEXT.PYTHON_CHALLENGE.heroHeadline}
              description={HERO_TEXT.PYTHON_CHALLENGE.heroDescription}
            />
            <Breadcrumb />
            <div className="challenge-editor">
              <div className="instructions col">
                <h4 className="column-header">CHALLENGE 1 Instructions</h4>
                  <p>
                    You will write two functions in this challenge. First write a function called <code>rec_dig_sum</code> that takes in an integer and returns the recursive digit sum of that number.
                    <br></br>
                    <br></br>
                    Examples of recursive digit sums:<br></br>
                    <code>101 => 1+0+1 = 2</code><br></br>
                    <code>191 => 1+9+1 = 11 => 1+1 = 2</code><br></br>
                    <code>5697 => 5+6+9+7 = 27 => 2+7 = 9</code>
                      <br></br>
                      <br></br>
                    Then use that function within another function called <code>distr_of_rec_digit_sums</code>, that returns a dictionary where the keys are recursive digit sums, and the values are the counts of those digit sums occurring between a low and high (inclusive) range of input numbers. Assume low and high are positive integers where high is greater than low. Your function should return a dictionary, not just print it. <br></br><br></br>
                  You can test your code as many times as you need. Your code will save if you need to come back later.<br></br><br></br>Need help? Our <a href="https://www.galvanize.com/data-science/prep">Prep Programs</a> are a great option to get up to speed!</p>
              </div>
              <div className="code-editor col">
                <h4 className="column-header">Challenge 1</h4>
                <CodeEditor
                  snippetId={SNIPPET_3.id}
                  codeTest={this.testCode}
                  codeSubmit={this.codeSubmit}
                  useCancelButton={true}
                  useResetInput={true}
                  cancelEndpoint={this.cancelRunningChallenge}
                  mode="python"
                  errorMessage={this.state.errorMessage || this.state.ch1Status}
                  allPassed={this.state.allPassed}
                  showProcessing={this.state.showProcessing}
                  submittingCode={this.state.submittingCode}
                  placeholder={this.state.snippet1Placeholder}
                />
                { ch1TestResults }
              </div>
            </div>
            <div className="challenge-editor">
              <div className="instructions col">
                <h4 className="column-header">Challenge 2 Instructions</h4>
                <p>Write a function called <code>sigmoid</code> that implements the sigmoid logistic function, as it
                is shown in <a href="https://en.wikipedia.org/wiki/Sigmoid_function" target="_blank">this article</a>.
                <br></br>
                <br></br>
                For the value of Euler's number <code>e</code> use <code>2.71828</code>.<br></br><br></br>Your function should return a number, not just print that number.</p>
              </div>
              <div className="code-editor col">
                <h4 className="column-header">Challenge 2</h4>
                <CodeEditor
                  snippetId={SNIPPET_4.id}
                  codeTest={this.testCode}
                  codeSubmit={this.codeSubmit}
                  useCancelButton={true}
                  useResetInput={true}
                  cancelEndpoint={this.cancelRunningChallenge}
                  mode="python"
                  errorMessage={this.state.errorMessage || this.state.ch2Status}
                  allPassed={this.state.allPassed}
                  showProcessing={this.state.showProcessing}
                  submittingCode={this.state.submittingCode}
                  placeholder={this.state.snippet2Placeholder}
                  />
                  { ch2TestResults }
              </div>
            </div>
            <div style={{textAlign: "center"}}>
              <button className={this.state.submittingCode ? "button-primary -loading" : "button-secondary"} disabled={!this.state.allPassed} onClick={ (e) => this.codeSubmit(e) }>Submit Code</button>
              <div className="error-wrapper">
                <br></br>
                <span className="form note form-error">{ this.state.submitErrorMessage }</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(PythonChallenge);
