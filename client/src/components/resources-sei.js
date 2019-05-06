import React from 'react';

import { INFO_SESSION_SEI_URL, CAMPUS_TOUR_SEI_URL, TECH_INTERVIEW_SEI_URL, PREP_SEI_URL} from '../constants';


export default (props) => {

  return (
    <div className="resources-block">
      <div className="block">
        <h4>Start Preparing Online</h4>
          <p>We offer different Prep courses based on your learning style.</p>
        <button><a className="button-secondary" href={PREP_SEI_URL} target="_blank" rel="noopener noreferrer">Sign Up for Prep</a></button>
      </div>
      <div className="block">
        <h4>Learn More</h4>
        <div>
        <ul>
          <li><a target="_blank" rel="noopener noreferrer" href={CAMPUS_TOUR_SEI_URL}>Tour a Campus</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href={INFO_SESSION_SEI_URL}>Attend an Info Session</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href={TECH_INTERVIEW_SEI_URL}>Technical Interview Details</a></li>
        </ul>
      </div>
      </div>
    </div>
  )
}
