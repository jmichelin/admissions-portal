import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';

import checkMark from '../assets/images/icon-checkmark-orange.png';
import xMark from '../assets/images/icon-xmark-orange.png';

import { SNIPPET_1, SNIPPET_2 } from '../constants';

import 'codemirror/lib/codemirror.css';
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/python/python');


class CodeEditor extends Component {
  constructor(props){
    super(props);

    let placeholder = "// Enter your code here"
    if (props.placeholder !== undefined) {
      placeholder = props.placeholder;
    }
    let snippetId = null
    if (props.snippetId !== undefined) {
      snippetId = props.snippetId
    }
    this.state = {
      code: placeholder,
      snippetId: snippetId,
      cursorPos: { line: 0, column: 0 },
      showButtons: true
    }
  }

  componentWillReceiveProps(nextProps) {
    let state = {}
    if (nextProps.placeholder !== this.props.placeholder) {
      state["code"] = nextProps.placeholder
    }
    if (nextProps.errorMessage !== this.props.errorMessage && nextProps.errorMessage === "Correct") {
      state["showButtons"] = false
    }
    if (state !== {}) {
      this.setState(state)
    }
  }

  resetInput() {
    if (this.props.snippetId === 1) {
      this.setState({code: SNIPPET_1.placeholder})
    } else {
      this.setState({code: SNIPPET_2.placeholder})
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

    let resetInput
    if (this.props.useResetInput && !this.props.showProcessing) {
      resetInput = (<button className="button-secondary" onClick={ (e) => this.resetInput() }>Reset Input</button>)
    }

    let correctMark = (<img alt=""src={checkMark} style={{top: "3px", position:"relative", height: "1.2rem"}}></img>)

    let incorrectMark = (<img alt=""src={xMark} style={{top: "3px", position:"relative", height: "1.2rem"}}></img>)

    let statusIcon
    if (this.props.errorMessage === "Correct") {
      statusIcon = correctMark
    } else if (this.props.errorMessage === "Err, try again…") {
      statusIcon = incorrectMark
    }

    let buttons = (
      <div>
        { cancelButton }
        { resetInput }
        <button className={this.props.showProcessing ? "button-primary -loading" : "button-primary"} onClick={ (e) => this.props.codeTest(this.state.code, e, this.state.snippetId) }>Run Tests</button>
        { submitCodeButton }
      </div>
    )
    if (!this.state.showButtons) {
      buttons = null
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
          <span>{statusIcon}{this.props.errorMessage}</span>
          { buttons }
        </div>
      </div>
    )
  }
}

export default CodeEditor;
