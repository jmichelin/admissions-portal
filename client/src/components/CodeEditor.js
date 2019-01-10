import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
require('codemirror/mode/javascript/javascript');


class CodeEditor extends Component {
  constructor(props){
    super(props);

    this.state = {
      code: '// Enter your code below',
      cursorPos: { line: 1, column: 0 },
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
    console.log('value', value);
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
    </div>
    )
  }
}

export default CodeEditor;
