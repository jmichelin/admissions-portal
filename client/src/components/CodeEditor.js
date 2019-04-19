import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/python/python');


class CodeEditor extends Component {
  constructor(props){
    super(props);

    let placeholder = "// Enter your code here"
    if (props.placeholder != undefined) {
      placeholder = props.placeholder;
    }
    let snippetId = null
    if (props.snippetId !== undefined) {
      snippetId = props.snippetId
    }
    this.state = {
      code: placeholder,
      snippetId: snippetId,
      cursorPos: { line: 0, column: 0 }
    }
  }

  render() {
    const options = {
      mode: this.props.mode,
      lineNumbers: true,
      lineWrapping: true,
      showCursorWhenSelecting: true,
      styleActiveLine: true
    }

    let submitCodeButton
    if (this.props.showSubmitButton) {
      submitCodeButton = (<button className={this.props.submittingCode ? "button-primary -loading" : "button-secondary"} disabled={!this.props.allPassed} onClick={ (e) => this.props.codeSubmit(e) }>Submit Code</button>)
    }

    let cancelButton
    if (this.props.useCancelButton && this.props.showProcessing) {
      cancelButton = (<button className="button-secondary" onClick={ (e) => this.props.cancelEndpoint() }>Cancel</button>)
    }
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
          { cancelButton }
          <button className={this.props.showProcessing ? "button-primary -loading" : "button-primary"} onClick={ (e) => this.props.codeTest(this.state.code, this.state.snippetId) }>Test Code</button>
          { submitCodeButton }
        </div>
      </div>
    )
  }
}

export default CodeEditor;
