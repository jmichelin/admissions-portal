import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './header.css';

class Header extends Component {
  render() {
  return (
  <header className="main-navigation">
    <nav className="nav-wrapper">
      <Link to='/dashboard' className="galvanize-logo"><img id="logo" alt="Galvanize Logo" src="https://s3-us-west-2.amazonaws.com/galvanize.com-dev/galvanize-logo.svg"></img></Link>
      <div className="nav-toggle"><i className="fa fa-bars fa-lg"></i></div>
      <div className="nav-items">
        <li className="nav-item">Courses<span className="caret"></span>
          <ul className="list">
            <span className="diagonal"></span>
            <li className="nav-item-subheader"><a href="#">Full-Time Courses</a><span><img src="https://s3-us-west-2.amazonaws.com/dotcom-files/arrow-01.png" alt=""></img></span>
              <ul>
                <li className="nav-list-item"><a href="#">Software Engineering Immersive</a></li>
                <li className="nav-list-item"><a href="#">Software Engineering Remote Immersive</a></li>
                <li className="nav-list-item"><a href="#">Data Science Immersive</a></li>
              </ul>
            </li>
            <li className="nav-item-subheader"><a href="#">Part-Time Courses</a><span><img src="https://s3-us-west-2.amazonaws.com/dotcom-files/arrow-01.png" alt=""></img></span>
              <ul>
                <li className="nav-list-item"><a href="#">Software Engineering Remote</a></li>
                <li className="nav-list-item"><a href="#">Data Analytics</a></li>
              </ul>
            </li>
            <li className="nav-item-subheader">Online Prep Courses
              <ul>
                <li className="nav-list-item"><a href="#">Software Engineering</a></li>
                <li className="nav-list-item"><a href="#">Data Science</a></li>
              </ul>
            </li>
            <li className="nav-item-subheader">Explore Coding
              <ul>
                <li className="nav-list-item"><a href="#">Meetups</a></li>
                <li className="nav-list-item"><a href="#">Workshops</a></li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="nav-item">Campuses<span className="caret"></span>
          <ul className="list">
            <span className="diagonal"></span>
            <li className="nav-list-item"><a href="#">Austin</a></li>
            <li className="nav-list-item"><a href="#">Boulder</a></li>
            <li className="nav-list-item"><a href="#">Denver (Golden Triangle)</a></li>
            <li className="nav-list-item"><a href="#">Denver (Platte)</a></li>
            <li className="nav-list-item"><a href="#">Los Angeles</a></li>
            <li className="nav-list-item"><a href="#">New York</a></li>
            <li className="nav-list-item"><a href="#">Phoenix</a></li>
            <li className="nav-list-item"><a href="#">San Francisco</a></li>
            <li className="nav-list-item"><a href="#">Seattle</a></li>
          </ul>
        </li>
        <div className="actions">
          <a href="#" className="button primary">ASK QUESTIONS</a>
        </div>
      </div>
    </nav>
  </header>
    )
  }
}

export default Header;
