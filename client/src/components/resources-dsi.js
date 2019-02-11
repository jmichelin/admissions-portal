import React from 'react';

import { INFO_SESSION_DSI_URL, CAMPUS_TOUR_URL, TECH_INTERVIEW_DSI_URL, PREP_DSI_URL} from '../constants';


export default (props) => {

  return (
    <div className="resources-block">
      <div className="block">
        <h4>Start Preparing Online</h4>
        <p>We offer different Prep courses based on your learning style.</p>
          <a className="button-secondary" href={PREP_DSI_URL} target="_blank" rel="noopener noreferrer">Sign Up for Prep</a>
      </div>
      <div className="block">
        <h4>Learn More</h4>
        <ul>
          <li><a target="_blank" rel="noopener noreferrer" href={CAMPUS_TOUR_URL}>Tour a Campus</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href={INFO_SESSION_DSI_URL}>Attend an Info Session</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href={TECH_INTERVIEW_DSI_URL}>Technical Interview Details</a></li>
        </ul>
      </div>
    </div>
  )
}
