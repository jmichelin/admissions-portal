import React from 'react';


export default (props) => {


  return (
    <div className="steps-list">
      <div className="steps">
        <div className="step">
          <span className="number">1</span>
          <span className="label">Application</span>
          <button className="button-secondary">Apply</button>
        </div>
        <div className="step">
          <span className="number">2</span>
          <span className="label">Coding Challenge</span>
          <button className="button-secondary">Start</button>
        </div>
        <div className="step">
          <span className="number">3</span>
          <span className="label">Technical Interview</span>
          <button className="button-secondary">Book</button>
        </div>
      </div>
    </div>
  )
}
