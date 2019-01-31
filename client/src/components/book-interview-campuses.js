import React from 'react';
import { Link } from 'react-router-dom';

import { CAMPUSES } from '../constants';

export default (props) => {

  let campusCards = CAMPUSES.map((campus, i) => {
    return (
      <div className="campus-card" key={i}>
        <h4>{campus.city}</h4>
        <button className="button-tertiary" onClick={() => {props.loadBookingTool(campus)}}>Book Interview</button>
      </div>
    )
  })

  return (
    <div>
    <h4 className="column-headline">Select an Interview Location</h4>
    <div className="card-holder">
      {campusCards}
    </div>
    </div>
  )
}
