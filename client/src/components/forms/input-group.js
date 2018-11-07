import React from 'react';

// import FormError from './form-error';
import Label from './label';
import TextField from './text-field';

export default (props) => {
  let error, errorClass;
  if (props.showError) {
    let errorMessage = props.errorMessage || 'This field is required';
    errorClass = '-error';
    // error = <FormError errorMessage={ errorMessage } />
  }

  return (
    <div>
      <Label optional={ props.optional } text={ props.label } />
      <TextField id={ props.name }
        fieldName={ props.fieldName }
        value={ props.value }
        onInputChange={ props.onInputChange }
        className={ errorClass }
        type={ props.type }
        cleave={ props.cleave } />
      { error }
      <span className="form-note">{ props.note }</span>
    </div>
  )
}
