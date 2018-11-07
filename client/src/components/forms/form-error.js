import React from 'react';

export default (props) => {
  return (
    <span className="form-note form-error">{ props.errorMessage }</span>
  )
}
