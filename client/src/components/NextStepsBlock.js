import React from 'react';
import { Link } from 'react-router-dom';


export default (props) => {

  let button =  props.step.buttonUrl ?
        <a href={props.step.buttonUrl} target="_blank" rel="noopener noreferrer">
          <button className="button-primary">
            {props.step.buttonText}
          </button>
        </a>
        : null;

  let deleteButton = props.showModal && props.opp.currentStep.step === 1 ?
        <div className="modal-button">
          <button className="-inline -white" onClick={() => props.showModal(props.opp)}>
            Delete Application
          </button>
        </div>
      : null;

  return (
    <div className={props.step.blockClass ? `next-steps ${props.step.blockClass}` : "next-steps"}>
      <div className="left-text">
        <h4>Next Steps</h4>
        <p className="-inverse">{props.step.description}</p>
        {props.step.alertText ?
          <p className="-alert -inverse">{props.step.alertText}&nbsp;
            {props.step.alertButtonPath && (
              <>
              <Link to={{
                pathname: `${props.step.alertButtonPath}`,
                state: { opp: props.opp },
                override: props.step.override
              }}
              >
              <button className="-inline">
                {props.step.alertButtonText}
              </button>
              </Link>
              </>
            )}
      </p> : null}
      </div>
      <div className="flex--col--center">
      {props.step.buttonPath && (
        <Link to={{
          pathname: `${props.step.buttonPath}`,
          state: { opp: props.opp },
          override: props.step.override
        }}
        >
          <button className="button-primary">
            {props.step.buttonText}
          </button>
        </Link>
      )}
        {button}
        {deleteButton}
      </div>
    </div>
  )
}
