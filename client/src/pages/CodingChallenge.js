import React, { Component } from 'react';

import Select from '../components/forms/select';
import inputs from '../components/forms/inputs/select-inputs';

import { CAMPUSES, FULL_TIME_PROGRAMS } from '../constants';


class CodingChallenge extends Component {
  constructor(props){
    super(props);

    this.state = {
    };
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({
      redirectToHome: true
    })
  }

  componentDidMount() {

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
                <p className="section-row">This quick coding challenge will test your understanding of basic JavaScript syntax and start you on your admissions journey. If you're new to programming or JavaScript, don't be deterred. Try this challenge as many times as you need; your application will not be affected by errors. Best of luck!</p>
                <div className="challenge-editor">
                  <div className="instructions col">
                    <h3 className="column-header">Instructions</h3>
                    <ol class="progress-bar">
                      <li>First, declare a variable named <code>myArray</code> and assign it to an empty array.</li>
                      <li>Great! Now populate <code>myArray</code> with two strings.<br></br>Put your full name in the first string, and your Skype handle in the second.</li>
                      <li>Next, declare a function named <code>cutName</code>. It should expect a parameter <code>name</code>.</li>
                      <li><code>cutName</code> should return an array by breaking up the input string into individual words.
                        <ul>
                          <li><b>Example:</b> cutName("Douglas Crockford") should return ["Douglas", "Crockford"]</li>
                          <li><b>Example:</b> cutName("John B. Smith") should return ["John", "B.", "Smith"]</li>
                        </ul>
                      </li>

                      <li>Declare a new variable named <code>myInfo</code> and assign it to an empty object literal.</li>
                      <li>Add the following three key-value pairs to <code>myInfo</code>:
                        <ul>
                          <li>
                            <b>Key:</b> <code>fullName</code><br />
                            <b>Value:</b> The result of calling <code>cutName</code> on the name string within <code>myArray</code>.
                          </li>
                          <li>
                            <b>Key:</b> <code>skype</code><br />
                            <b>Value:</b> The Skype handle within <code>myArray</code>.
                          </li>
                          <li>
                            <b>Key:</b> <code>github</code><br />
                            <b>Value:</b>
                              If you have a github handle, enter it here as a string.
                              If not, set this to <code>null</code> instead.
                          </li>
                        </ul>
                        </li>
                    </ol>
                  </div>
                  <div className="code-editor col">
                    <h3 className="column-header">Code Editor</h3></div>
                </div>
                </div>
            </div>
          </div>
      </div>
    )
  }
}

export default CodingChallenge;
