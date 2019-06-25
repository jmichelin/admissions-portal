import React from 'react';
import FormError from './form-error';
import TextField from './text-field';

export default (props) => {
  let error, errorClass;

  if (props.showError) {
    let errorMessage = props.errorMessage || 'This field is required';
    errorClass = '-error';
    error = <FormError errorMessage={errorMessage} />
  }

  return (
    <div className="input-group">
      <TextField id={props.name}
        fieldName={props.fieldName}
        value={props.value}
        placeholder={props.placeholder}
        onInputChange={props.onInputChange}
        className={errorClass}
        type={props.type}
        cleave={props.cleave} />
      {error}
      <span className="form-note">{props.note}</span>
    </div>
  )
}
