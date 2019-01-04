import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './header.css';

class Header extends Component {
  render() {
  return (
  <header>
  <nav className="main-navigation-new">
  <div className="nav-wrapper">
    <Link to='/dashboard' className="galvanize-logo"><img id="logo" alt="Galvanize Logo" src="https://s3-us-west-2.amazonaws.com/galvanize.com-dev/galvanize-logo.svg"></img></Link>
    <div className="nav-toggle"><i className="fa fa-bars fa-lg"></i></div>
    <div className="nav-items">
      <li className="nav-item">Courses<span className="caret"></span>
        <ul>
          <span className="diagonal"></span>
          <li className="nav-item-subheader"><a href="#">Full-Time Courses</a><span><img src="https://s3-us-west-2.amazonaws.com/dotcom-files/arrow-01.png" alt=""></img></span>
            <ul>
              <li className="nav-list-item"><a href="#">Software Engineering Immersive</a></li>
              <li className="nav-list-item"><a href="#">Software Engineering Remote</a><span>Live Online</span></li>
              <li className="nav-list-item"><a href="#">Data Science Immersive</a></li>
            </ul>
          </li>
          <li className="nav-item-subheader"><a href="#">Part-Time Courses</a><span><img src="https://s3-us-west-2.amazonaws.com/dotcom-files/arrow-01.png" alt=""></img></span>
            <ul>
              <li className="nav-list-item"><a href="#">Software Engineering</a><span>Live Online</span></li>
              <li className="nav-list-item"><a href="#">Data Science Nights & Weekends</a></li>
            </ul>
          </li>
          <li className="nav-item-subheader"><a href="#">Prep Courses</a><span><img src="https://s3-us-west-2.amazonaws.com/dotcom-files/arrow-01.png" alt=""></img></span>
            <ul>
              <li className="nav-list-item"><a href="#">Structured Study Program</a><span>Online</span></li>
              <li className="nav-list-item"><a href="#">Software Engineering Prep</a><span>Online</span><span className="-inverse">Free</span></li>
              <li className="nav-list-item"><a href="#">Data Science Prep</a><span>Online</span><span className="-inverse">Free</span></li>
              <li className="nav-list-item"><a href="#">Data Science Premium Prep</a><span>Online</span></li>
            </ul>
          </li>
          <li className="nav-item-subheader"><a href="#">Explore Coding</a><span><img src="https://s3-us-west-2.amazonaws.com/dotcom-files/arrow-01.png" alt=""></img></span>
            <ul>
              <li className="nav-list-item"><a href="#">Meetups</a><span className="-inverse">Free</span></li>
              <li className="nav-list-item"><a href="#">Workshops</a><span className="-inverse">Free</span></li>
            </ul>
          </li>
        </ul>
      </li>
      <li className="nav-item">Campuses<span className="caret"></span>
        <ul>
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
        <a href="#" className="button primary">REQUEST INFO</a>
      </div>
    </div>
  </div>
</nav>

  </header>
    )
  }
}

export default Header;
