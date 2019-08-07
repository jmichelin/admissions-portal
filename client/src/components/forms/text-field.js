import React from 'react';
// import Cleave from 'cleave.js/dist/cleave-react';
// import CleavePhone from 'cleave.js/dist/addons/cleave-phone.us';

export default (props) => {

  if (props.type === 'textarea') {
    return (
      <>
      <textarea
        rows="6"
        cols="100"
        id={ props.id }
        value={ props.value }
        onChange={ (e) => { props.onInputChange(e) } }
        className={ props.className }
        placeholder={ props.placeholder }
      />
    <div  className="char-count">
      <span>Between 150 and 1500 characters</span>
      <span>({props.charCount})</span>
    </div>
    </>
    )
  }

  return (
    <input
      id={ props.id }
      name={props.id }
      type={ props.type || "text"}
      value={ props.value }
      onChange={ (e) => { props.onInputChange(e) } }
      className={ props.className }
      placeholder={ props.placeholder }
    />
  )
}
