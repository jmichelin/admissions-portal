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
    let cleanCode = code.includes('//') ? code.replace(/\s/g, " ").split('// Enter your code here')[1] : code;
    this.setState ({
      code: cleanCode
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
