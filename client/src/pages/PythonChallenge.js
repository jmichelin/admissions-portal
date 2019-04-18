import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';

import { PYTHON_CHALLENGE_ENDPOINT, DSI_STEPS, HERO_TEXT } from '../constants';
import CodeEditor from '../components/CodeEditor';

class PythonChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
      opp: {},
      code: '',
      showProcessing: false,
      submittingCode: false,
      errorMessage: "Test your code for correctness before submitting to admissions.  Click Submit once you feel comfortable continueing.",
      redirectToDashboard: false,
      attemptSubmitted: false
    };

    this.codeSubmit = this.codeSubmit.bind(this);
    this.testCode = this.testCode.bind(this);
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

  testCode(code, e) {
    e.preventDefault();

    let data = {
      answer: code,
      snippet_id: 1
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
        console.log(response.json())
      }
      throw new Error();
    }).then(result => {
      this.setState({ attemptSubmitted: true});
    }).catch(err => {
      this.setState({ redirectToDashboard: true});
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
              {/* <CodingInstructions tests={this.state.localTestResults} allPassed={this.state.allPassed}/> */}
              <div className="code-editor col">
                <h4 className="column-header">Code Editor</h4>
                <CodeEditor
                  codeTest={this.testCode}
                  codeSubmit={this.codeSubmit}
                  mode="python"
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

export default PythonChallenge;
