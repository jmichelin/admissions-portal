import React from 'react';

export default (props) => {

  return (
    <div className="hero">
      <h3 className="hero-title">{props.headline}</h3>
      <p className="section">{props.description}</p>
    </div>
  )
}
