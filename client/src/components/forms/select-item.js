import React from 'react';

export default (props) => {

  if (props.disabled) {
    return (
      <option value="" disabled>
        Select one
      </option>
    )
  }

  return (
    <option value={ props.option.value || props.option.optionValue || props.option.sfdcName } >
      { props.option.optionName || props.option.name }
    </option>
  )
}
