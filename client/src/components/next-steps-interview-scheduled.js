import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {

  return (
    <div className="next-steps -gray">
      <div className="">
        <h4>Next Steps</h4>
        <p className="-inverse">Your interview is booked! Prepare to pass your Technical Interview by enrolling in a Galvanize Software Engineering Prep course or by practicing the JavaScript fundamentals on your own.</p>
        <p className="-inverse">Need to reschedule or cancel your interview?  Refer to your booking confirmation email. <br></br><br></br><span className="-alert">NOTE: If you booked your interview within the Hack Reactor Admissions Portal and are trying to reschedule please <Link className="inverse" to={{
                    pathname: "/book-interview",
                    state: { opp: props.opp, override: true} }}>
                    click here</Link> to rebook. We will handle cancelling your old booking on our end.</span></p>
      </div>
    </div>
  )
}
