import React from 'react';
import { Link } from 'react-router-dom';

import { SEI_STEPS_12_WK } from '../constants';

export default (props) => {

  return (
    <div className={props.step.blockClass ? `next-steps ${props.step.blockClass}` : "next-steps"}>
      <div className="left-text">
        <h4>Next Steps</h4>
        <p className="-inverse">{props.step.description}</p>
        {props.alertText ? <p className="-alert -inverse">{props.step.alertText}</p> : null}
      </div>
      { props.step.buttonPath ? <Link to={{
            pathname: `${props.step.buttonPath}`,
            state: { opp: props.opp},
            override: props.step.override }}>
            <button className="button-primary">{props.step.buttonText}</button></Link> : null}
      </div>
  )
}
