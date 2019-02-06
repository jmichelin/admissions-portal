import React from 'react';
import { Redirect, Link } from 'react-router-dom';

export default (props) => {

  if (props.previousComponent && !props.linkUrl) {
    return (
      <div className="breadcrumb">
        <button className="-inline" onClick={(e) => props.previousComponent()}>&#8592; {props.text ? props.text : 'Back to Dashboard'}</button>
      </div>
    )
  }

  return (
    <div className="breadcrumb">
      <Link to={props.linkUrl ? props.linkUrl : '/dashboard'}><button className="-inline">&#8592; {props.text ? props.text : 'Back to Dashboard'}</button></Link>
    </div>
  )
}
