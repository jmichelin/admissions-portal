import React from 'react';
// import Cleave from 'cleave.js/dist/cleave-react';
// import CleavePhone from 'cleave.js/dist/addons/cleave-phone.us';

export default (props) => {

  if (props.type === 'textarea') {
    return (
      <textarea
        rows="6"
        cols="100"
        id={ props.id }
        defaultValue={ props.defaultValue }
        onChange={ (e) => { props.onInputChange(e) } }
        className={ props.className }
        placeholder={ props.placeholder }
      />
    )
  }

  // if (props.cleave) {
  //   let formatting = props.fieldName === 'Phone' ?
  //     { phone: true, phoneRegionCode: 'US', delimiter: '-' } : { date: true, datePattern: ['m', 'd', 'Y']};
  //
  //   return <Cleave
  //     options={ formatting }
  //     type={ props.type }
  //     autoComplete={ props.autocomplete || '' }
  //     autoCorrect={ props.autocorrect || '' }
  //     autoCapitalize={ props.autocapitalize || '' }
  //     value={ props.defaultValue }
  //     id={ props.id }
  //     className={ props.className }
  //     placeholder={ props.placeholder }
  //     onChange={ (e) => { props.onInputChange(e, props.fieldName) } }
  //   />
  // }

  return (
    <input
      id={ props.id }
      type={ props.type || "text"}
      value={ props.value }
      onChange={ (e) => { props.onInputChange(e) } }
      className={ props.className }
      placeholder={ props.placeholder }
    />
  )
}
