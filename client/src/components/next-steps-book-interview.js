import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {

  return (
    <div className="next-steps">
      <div>
        <h4>Next Steps</h4>
        <p className="-inverse"><span>Book Your Technical Interivew</span>  Study up and be ready to live-pair with an instructor on the call.</p>
      </div>
      <Link to={{
            pathname: "/book-interview",
            state: { oppId: props.oppId} }}>
            <button className="button-primary">Schedule Your Interview</button></Link>
      </div>
  )
}
