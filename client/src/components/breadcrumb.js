import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => (
  <div className="breadcrumb">
    <Link to={{
      pathname: "/dashboard",
      state: { dataRefresh: props.refreshData}
    }}>
      <button className="-inline">
        &#8592; Back to Dashboard
      </button>
    </Link>
    {props.previousComponent && !props.linkUrl && (
      <button className="-inline" onClick={(e) => props.previousComponent()}>{props.text ? props.text : 'Back to Dashboard'}</button>
    )}
  </div>
)
