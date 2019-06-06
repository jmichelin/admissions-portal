import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => (
  <div className={props.step.blockClass ? `next-steps ${props.step.blockClass}` : "next-steps"}>
    <div className="left-text">
      <h4>Next Steps</h4>
      <p className="-inverse">{props.step.description}</p>
      {props.step.alertText ? <p className="-alert -inverse">{props.step.alertText}</p> : null}
    </div>
    {props.step.buttonPath && (
      <Link to={{
        pathname: `${props.step.buttonPath}`,
        state: { opp: props.opp },
        override: props.step.override
      }}>
        <button className="button-primary">
          {props.step.buttonText}
        </button>
      </Link>
    )}
    {props.step.buttonUrl && (
      <a href={props.step.buttonUrl} target="_blank">
        <button className="button-primary">
          {props.step.buttonText}
        </button>
      </a>
    )}
  </div>
)
