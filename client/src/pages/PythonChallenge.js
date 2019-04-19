import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';

import { PYTHON_CHALLENGE_ENDPOINT, DSI_STEPS, HERO_TEXT } from '../constants';
import { SNIPPET_1, SNIPPET_2 } from '../constants';
import CodeEditor from '../components/CodeEditor';

class PythonChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
      opp: {},
      code: '',
      showProcessing: false,
      submittingCode: false,
      ch1Status: "",
      ch2Status: "",
      errorMessage: "",
      redirectToDashboard: false,
      attemptSubmitted: false,
      runningTestId: null
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
    } else {
      this.setState({ redirectToDashboard: true })
    }
  }

  testCode(code, snippetId) {
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
            if (data.snippet_id === 1) {
              this.setState({ 
                showProcessing: false, 
                runningTestId: null, 
                ch1Status: data.status.charAt(0).toUpperCase() + data.status.slice(1) 
              });
            } else {
              this.setState({ 
                showProcessing: false, 
                runningTestId: null, 
                ch2Status: data.status.charAt(0).toUpperCase() + data.status.slice(1) 
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
    // What to do if the user wants to submit?
  }

  render() {
    if (this.state.redirectToDashboard) {
      return (<Redirect to='/dashboard'/>)
    }
    return (
      <div className="coding-challenge">
        <div className="container">
          <div className="portal-inner">
            
            <Hero headline={HERO_TEXT.PYTHON_CHALLENGE.heroHeadline} description={HERO_TEXT.PYTHON_CHALLENGE.heroDescription}/>
            <Breadcrumb />
            
            <div className="challenge-editor">
              <div className="instructions col">
                <h4 className="column-header">CHALLENGE 1 Instructions</h4>
                <p>{SNIPPET_1.question}</p>
              </div>
              <div className="code-editor col">
                <h4 className="column-header">Challenge 1</h4>
                <CodeEditor
                  snippetId={SNIPPET_1.id}
                  codeTest={this.testCode}
                  codeSubmit={this.codeSubmit}
                  useCancelButton={true}
                  cancelEndpoint={this.cancelRunningChallenge}
                  testCodeText="Test Code"
                  mode="python"
                  errorMessage={this.state.ch1Status}
                  allPassed={this.state.allPassed}
                  showProcessing={this.state.showProcessing}
                  submittingCode={this.state.submittingCode}
                  placeholder={SNIPPET_1.placeholder}
                />
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
                  cancelEndpoint={this.cancelRunningChallenge}
                  testCodeText="Test Code"
                  mode="python"
                  errorMessage={this.state.ch2Status}
                  allPassed={this.state.allPassed}
                  showProcessing={this.state.showProcessing}
                  submittingCode={this.state.submittingCode}
                  placeholder={SNIPPET_2.placeholder}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PythonChallenge;
