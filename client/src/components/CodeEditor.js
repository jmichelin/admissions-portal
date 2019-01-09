import React, { Component } from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');


class CodeEditor extends Component {
  constructor(props){
    super(props);

    this.state = {
    }


  }

  render() {
  return (
    <div className="editor-wrapper">
      <CodeMirror
        value='<h1>I ♥ react-codemirror2</h1>'
        options={{
          mode: 'javascript',
          lineNumbers: true
        }}
        onChange={(editor, data, value) => {
        }}
      />
    </div>
    )
  }
}

export default CodeEditor;
