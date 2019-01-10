import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
require('codemirror/mode/javascript/javascript');


class CodeEditor extends Component {
  constructor(props){
    super(props);

    this.state = {
      code: '// Enter your code here',
      cursorPos: { line: 0, column: 0 },
      selectionLength: 0
    }

    this.beforeChangeFunction = this.beforeChangeFunction.bind(this);

  }

  componentDidMount() {
    this.instance.on('cursorActivity', (e) => {
    var pos = e.getCursor()
    this.setState(prevState => ({
        cursorPos: {
            ...prevState.cursorPos,
            line: pos.line,
            column: pos.ch
          },
          selectionLength: e.getSelection().length
    }))
  })
  }

  beforeChangeFunction(data, value) {
  }


  render() {

    const options = {
      mode: 'javascript',
      lineNumbers: true,
      showCursorWhenSelecting: true,
      styleActiveLine: true
    }



  return (
    <div className="editor-wrapper">
      <CodeMirror
       editorDidMount={editor => { this.instance = editor }}
       value={this.state.code}
       options={options}
       cursor={this.state.cursorPos}
       onBeforeChange={(editor, data, code) => {this.setState({code});}}
       onChange={(editor, data, value) => {this.beforeChangeFunction(data, value)}}/>
       <div className="action">
         <span>{this.props.errorMessage}</span>
         <button className="button-primary" onClick={ () => this.props.codeSubmit(this.state.code) }>Run Code</button>
       </div>
    </div>
    )
  }
}

export default CodeEditor;
