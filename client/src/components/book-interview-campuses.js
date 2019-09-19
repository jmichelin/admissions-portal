import React from 'react';

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
    <div className="grouping">
      <h4 className="column-headline">Select an Interview Location</h4>
      <p className="-center">All campuses share the same assessment format and rubric, so you can select any location that has availability that's most convenient for you, regardless of your preferred campus.</p>
      <div className="card-holder">
        {campusCards}
      </div>
    </div>
  )
}
