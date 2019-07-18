import React from 'react';

export default (props) => {

  if (props.disabled) {
    return (
      <option value="" disabled>
        {props.placeholder ? props.placeholder : 'Select one' }
      </option>
    )
  }

  return (
    <option value={ props.option.value || props.option.optionValue || props.option.sfdcName || props.option.courseType } >
      { props.option.optionName || props.option.name || props.option.courseName }
    </option>
  )
}
