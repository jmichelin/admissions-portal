import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {

  return (
    <div className="next-steps -grey">
      <div className="left-text">
        <h4>Next Steps</h4>
        <p className="-inverse">Click to review the coding challenge question prior to beginning your assessment. There is no limit to how many times you can attempt this challenge.  After passing the challenge, submit your code to continue the admissions process for this program.</p>
      </div>
      <Link to={{
            pathname: "/coding-challenge",
            state: { opp: props.opp} }}>
            <button className="button-primary">Begin Coding Challenge</button></Link>
    </div>
  )
}
