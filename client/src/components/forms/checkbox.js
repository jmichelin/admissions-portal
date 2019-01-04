import React from 'react';
import FormError from './form-error';

import { GALVANIZE_BASE_URL } from '../../constants';

export default (props) => {
  let error;
  if (props.showError) {
    error = <FormError errorMessage={ props.errorMessage || 'This is required' } />
  }

  return (
    <div className="checkbox-field">
      <input type="checkbox" id={ props.name } name={ props.name } checked={ props.checked } onChange={ (e) => { props.onInputChange(e) } } />
      { props.terms
        ?  <span> I agree to Galvanize's<a rel="noopener noreferrer" target="_blank" href={ `${GALVANIZE_BASE_URL}/privacy` }> Privacy Policy </a>and <a rel="noopener noreferrer" target="_blank" href={ `${GALVANIZE_BASE_URL}/terms-of-use` }> Terms of Service</a></span>
        : <span>{props.label}</span>
      }
      { error }
    </div>
  )
}
