import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {

  return (
    <div className="next-steps -grey">
      <div>
        <h4>Next Steps</h4>
        <p className="-inverse"><span>Complete the Coding Challenge.</span>  Try as many times as you need and submit the code when you're ready.</p>
      </div>
      <Link to={{
            pathname: "/coding-challenge",
            state: { oppId: props.oppId} }}>
            <button className="button-primary">Start the Challenge</button></Link>
      </div>
  )
}
