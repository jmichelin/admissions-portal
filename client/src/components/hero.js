import React from 'react';

export default (props) => (
  <div className="hero">
    <h3 className="hero-title">{props.headline}</h3>
    <p className="section">{props.description}</p>
  </div>
)

