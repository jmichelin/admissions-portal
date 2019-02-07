import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {

  return (
    <div className="next-steps -blue">
      <div className="left-text">
        <h4>Next Steps</h4>
        <p className="-inverse">Choose a time to complete your technical interview. Prepare to pass your Technical Interview by enrolling in a Galvanize Software Engineering Prep course or by practicing JavaScript fundamentals on your own.</p>
      </div>
      <Link to={{
            pathname: "/book-interview",
            state: { opp: props.opp} }}>
            <button className="button-primary">Schedule Your Interview</button></Link>
    </div>
  )
}
