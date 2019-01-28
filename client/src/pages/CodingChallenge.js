import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import * as buble from 'buble'

 import { CODING_CHALLENGE_TESTS } from '../constants';
import CodingInstructions from '../components/CodingInstructions';
import CodeEditor from '../components/CodeEditor';

class CodingChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
      oppId:'',
      code: '',
      localTestResults: [],
      showProcessing: false,
      allPassed: false,
      errorMessage: '',
      redirectToDashboard: false
    };

    this.runLocal = this.runLocal.bind(this);
    this.codeSubmit = this.codeSubmit.bind(this);
  }

  componentWillMount() {
    if (!this.props.fetchedData) this.props.getData();
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
    let CODE_CHALLENGE_ENDPOINT = '/api/v1/user/code-submit';
    e.preventDefault();
      if (this.state.allPassed && this.state.submittedCode) {
        let data = {
          code: this.state.submittedCode,
          oppId: this.state.oppId
        }
        fetch(CODE_CHALLENGE_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            'content-type': 'application/json'
          },
        }).then(response => {
          console.log(response);
          if (response.ok) {
            return response.json()
          }
          return response.json().then(error => {
            throw new Error(error.message)
          })
        }).then(result => {
          this.setState({ isLoading: false, redirectToDashboard:true});
        }).catch(err => {
            this.setState({
              errorMessage: err.message
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
              <h4 className="page-title">Coding Challenge</h4>
              <Link to="/dashboard"><button className="-inline">Back to Dashboard</button></Link>
              <div className="portal-inner">
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
    )
  }
}

export default CodingChallenge;
