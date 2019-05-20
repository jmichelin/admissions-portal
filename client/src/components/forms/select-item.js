import React from 'react';

export default (props) => {

  if (props.disabled) {
    return (
      <option value="" disabled>
        Select one
      </option>
    )
  }

  if (props.program && props.program.includes('Remote')) {
    return (
      <option value={ props.option.value } disabled={!props.option.name.includes('Remote')}>
        { props.option.name }
      </option>
    )
  }

  if (props.program && !props.program.includes('Remote')) {
    return (
      <option value={ props.option.value } disabled={props.option.name.includes('Remote')}>
        { props.option.name }
      </option>
    )
  }


  return (
    <option value={ props.option.value || props.option.optionValue || props.option.sfdcName } >
      { props.option.optionName || props.option.name }
    </option>
  )
}
