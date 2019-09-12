import React from 'react';

import HRLogo from '../assets/images/hack-reactor-white-blue-horizontal-logo.png';

export default (props) => {

  return (
    <div className="portal-aside">
      <h1 className="title">Admissions Portal</h1>
      <div className="logo-wrapper">
        <img className="logo" src="https://s3-us-west-2.amazonaws.com/dotcom-files/Galvanize_Logo.png" alt="Galvanize Logo"></img>
        <img className="logo -hr" src={HRLogo} alt="Hack Reactor Logo"></img>
      </div>
      <div className="program-block">
          <p>From here you can get started with the admissions process for the Galvanize Data Science Immersive or the Hack Reactor Software Engineering Immersive.</p>
          <p>Start your application, pass the coding challenge, and book your technical interview to begin your journey of becoming a Data Scientist or Software Engineer.</p>
        </div>
      <div className="program-block -campuses">
        <span className="campus-line">Austin <span>&bull;</span> Boulder <span>&bull;</span> Denver <span>&bull;</span> Los Angeles</span>
        <span className="campus-line">New York <span>&bull;</span> Phoenix<span>&bull;</span> San Francisco <span>&bull;</span> Seattle <span>&bull;</span> Remote</span>
        <span className="campus-line"></span>
      </div>
    </div>
  )
}
