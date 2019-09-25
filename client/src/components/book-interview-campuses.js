import React from 'react';

import { CAMPUSES } from '../constants';

export default (props) => {

  let campusCards = CAMPUSES.map((campus, i) => {
    return (
      <div className="campus-card" key={i}>
        <h4>{campus.city}</h4>
        <button className="button-tertiary" onClick={() => {props.loadBookingTool(campus)}}>Book Assessment</button>
      </div>
    )
  })

  return (
    <div className="grouping">
      <h4 className="column-headline">Select a Calendar</h4>
      <p className="-center">All campuses share the same assessment format and rubric, so you can select any location that has availability that's most convenient for you, regardless of your preferred campus.</p>
      { props.holdText && <p className="-center"><span className="-bold">Important</span>: Be sure to book your next assessment <span className="-bold">at least two weeks after</span> your previous attempt.</p> }
    <div className="card-holder">
        {campusCards}
      </div>
    </div>
  )
}
