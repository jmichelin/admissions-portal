import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';

import {
  PYTHON_CODE_SUBMIT_ENDPOINT,
  UPDATE_OPP_ENDPOINT,
  UPDATE_SCORECARD_ENDPOINT,
  PYTHON_CHALLENGE_ENDPOINT,
  DSI_STEPS,
  HERO_TEXT,
} from '../constants';
import { SNIPPET_1, SNIPPET_2 } from '../constants';
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
      redirectToDashboard: false,
      attemptSubmitted: false,
      runningTestId: null,
      userChallenges: [],
      ch1Status: "",
      ch2Status: "",
      ch1TestResults: "",
      ch2TestResults: "",
      snippet1Placeholder: SNIPPET_1.placeholder,
      snippet2Placeholder: SNIPPET_2.placeholder
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
      if (window && window.analytics) window.analytics.page('Python Challenge')
      if (["New", "New - Pending AA", "Appointment", "Studying"].indexOf(opp.stage) > -1) {
        fetch(UPDATE_OPP_ENDPOINT, {
          method: "POST",
          body: JSON.stringify({oppId: opp.id, stageName: "Sent Takehome"}),
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            'content-type': 'application/json'
          },
        })
      }

      if (opp.scorecard.moveForwardCode === null) {
        fetch(UPDATE_SCORECARD_ENDPOINT, {
          method: "POST",
          body: JSON.stringify({scorecardId: opp.scorecardId, moveForward: "No"}),
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            'content-type': 'application/json'
          },
        })
      }

      fetch(`${PYTHON_CHALLENGE_ENDPOINT}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'content-type': 'application/json'
        },
      }).then(response => {
        if (response.ok) {
          response.json().then((data) => {
            let snippet1Placeholder = SNIPPET_1.placeholder
            let snippet2Placeholder = SNIPPET_2.placeholder
            let ch1Status = ""
            let ch2Status = ""
            let allPassed = false
            for(var i = 0;i < data.length; i++) {
              if (data[i].snippet_id === 1) {
                snippet1Placeholder = data[i].answer
                if (data[i].status === "correct"){
                  ch1Status = data[i].status.charAt(0).toUpperCase() + data[i].status.slice(1)
                }
              } else if (data[i].snippet_id === 2) {
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
      })
    } else {
      this.setState({ redirectToDashboard: true })
    }
  }

  testCode(code, e, snippetId) {
    let data = {
      answer: code,
      snippet_id: snippetId
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
        response.json().then((data) => {
          this.setState({ showProcessing: true, runningTestId: data.id });
          this.pollForChallenge(data.id)
        })
        return
      } else {
        this.setState({ errorMessage: "err" });
      }
    }).then(result => {
      this.setState({ attemptSubmitted: true });
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
        response.json().then((data) => {
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
            if (data.snippet_id === 1) {
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
        return
      } else {
        this.setState({ errorMessage: "err" });
      }
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
        response.json().then((data) => {
        })
        return
      } else {
        this.setState({ errorMessage: "err" });
      }
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
        throw new Error();
      }).then(result => {
        let stageUpdate = DSI_STEPS.STEP_THREE;
        this.props.statusUpdate(this.state.opp.id, stageUpdate)
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
                    Complete the function <code>consonant_first</code> according to its docstring.<br></br><br></br>
                    You can test your code as many times as you need. Your code will also save if you need to come back later.  <br></br><br></br>Need help? Our <a href="https://www.galvanize.com/data-science/prep">Prep Programs</a> are a great option to get up to speed!
                  </p>
              </div>
              <div className="code-editor col">
                <h4 className="column-header">Challenge 1</h4>
                <CodeEditor
                  snippetId={SNIPPET_1.id}
                  codeTest={this.testCode}
                  codeSubmit={this.codeSubmit}
                  useCancelButton={true}
                  useResetInput={true}
                  cancelEndpoint={this.cancelRunningChallenge}
                  mode="python"
                  errorMessage={this.state.ch1Status}
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
                <p>{SNIPPET_2.question}</p>
              </div>
              <div className="code-editor col">
                <h4 className="column-header">Challenge 2</h4>
                <CodeEditor
                  snippetId={SNIPPET_2.id}
                  codeTest={this.testCode}
                  codeSubmit={this.codeSubmit}
                  useCancelButton={true}
                  useResetInput={true}
                  cancelEndpoint={this.cancelRunningChallenge}
                  mode="python"
                  errorMessage={this.state.ch2Status}
                  allPassed={this.state.allPassed}
                  showProcessing={this.state.showProcessing}
                  submittingCode={this.state.submittingCode}
                  placeholder={this.state.snippet2Placeholder}
                  />
                  { ch2TestResults }
              </div>
            </div>
            <div style={{textAlign: "center"}}>
              <button
                className={this.state.submittingCode ? "button-primary -loading" : "button-secondary"}
                disabled={!this.state.allPassed}
                onClick={(e) => this.codeSubmit(e)}>
                  Submit Code
              </button>
              <br/>
              <br/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PythonChallenge;
