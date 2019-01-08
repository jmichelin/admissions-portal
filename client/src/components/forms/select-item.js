import React from 'react';

export default (props) => {

  if (props.disabled) {
    return (
      <option disabled selected>
        Select one
      </option>
    )
  }
  
  return (
    <option value={ props.option.value } >
      { props.option.name }
    </option>
  )
}
