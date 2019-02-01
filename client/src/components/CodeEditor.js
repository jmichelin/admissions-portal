import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
require('codemirror/mode/javascript/javascript');


class CodeEditor extends Component {
  constructor(props){
    super(props);

    this.state = {
      code: '// Enter your code here',
      cursorPos: { line: 0, column: 0 }
      }
    }

  render() {
    const options = {
      mode: 'javascript',
      lineNumbers: true,
      showCursorWhenSelecting: true,
      styleActiveLine: true
    }

    let runCodeButton = <button className={this.props.showProcessing ? "button-primary -loading" : "button-primary"} onClick={ (e) => this.props.codeTest(this.state.code, e) }>Run Code</button>
    let submitCodeButton = <button className={this.props.showProcessing ? "button-primary -loading" : "button-primary"} onClick={ (e) => this.props.codeSubmit(e) }>Submit Code</button>

  return (
    <div className="editor-wrapper">
      <CodeMirror
       editorDidMount={editor => { this.instance = editor }}
       value={this.state.code}
       options={options}
       cursor={this.state.cursorPos}
       onBeforeChange={(editor, data, code) => {this.setState({code})}}/>
       <div className="action">
         <span>{this.props.errorMessage}</span>

       {this.props.allPassed ? submitCodeButton : runCodeButton}
       </div>
    </div>
    )
  }
}

export default CodeEditor;
