import React from 'react';

export default (props) => {
  let label = props.optional ?
    <label className="form-label">{ props.text } <span className="input-optional">  (optional)</span></label> :
    <label className="form-label">{ props.text }</label>

  return (
    <div>
      { label }
    </div>
  )
}
