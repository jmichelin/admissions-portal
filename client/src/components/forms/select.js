import React from 'react';
import FormError from './form-error';
import Label from './label';
import SelectItem from './select-item';

export default (props) => {
  let selectClasses = props.className;
  let error;

  if (props.showError) {
    selectClasses += ' -error';
    let errorMessage = props.errorMessage || 'Please select one';
    error = <FormError errorMessage={ errorMessage } />
  }

  const options = props.options.map((option, i) => {
    return <SelectItem  key={i} option={option} />
  });

  if (!props.value) {
    options.unshift(<SelectItem key="disabled" disabled="true" placeholder={props.placeholder} />)
  }

  return (
    <div className="input-group">
      {props.label && <Label optional={ props.optional } text={ props.label } />}
      <select
        name={props.name}
        id={props.id}
        className={selectClasses}
        placeholder={props.placeholder}
        value={props.value ? props.value : ""}
        disabled={ props.disabled }
        onChange={(e) => { props.onOptionClick(e, props.fieldName) }}
      >
        {options}
      </select>
      {error}
    </div>
  )
}
