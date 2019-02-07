import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {

  let rightLink;

  if (props.previousComponent && !props.linkUrl) {
      rightLink = <button className="-inline" onClick={(e) => props.previousComponent()}>{props.text ? props.text : 'Back to Dashboard'}</button>
  }

  return (
    <div className="breadcrumb">
      <Link to={{
            pathname: "/dashboard",
            state: { calendarRefresh: props.refreshCalendar} }}><button className="-inline">&#8592; Back to Dashboard</button></Link>
      {rightLink}
</div>
  )
}
