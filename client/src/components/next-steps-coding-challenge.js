import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {

  return (
    <div className="next-steps -grey">
      <div className="left-text">
        <h4>Next Steps</h4>
        <p className="-inverse">Click “<span>Begin Coding Challenge</span>,” to review the coding challenge question prior to beginning your assessment. There is no limit to how many times you can attempt this challenge.</p>
      </div>
      <Link to={{
            pathname: "/coding-challenge",
            state: { opp: props.opp} }}>
            <button className="button-primary">Begin Coding Challenge</button></Link>
      </div>
  )
}
