import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Header extends Component {
  constructor(props){
    super(props);

    this.state = {
      returnToHomepage: false,
      mobileNav: false,
      activeNavItem: false
    }

    this.toggleMobileNav = this.toggleMobileNav.bind(this);
    this.toggleMobileNavItem = this.toggleMobileNavItem.bind(this);
    this.logout = this.logout.bind(this);
  }


  toggleMobileNav() {
    this.setState({
      mobileNav: !this.state.mobileNav
    })
  }

  toggleMobileNavItem(item) {
  let itemName = item.target.getAttribute('data-tag')
  if (this.state.mobileNav) {
    this.setState({
      activeNavItemName: itemName
    })
  }
  if (itemName === this.state.activeNavItemName) {
    this.setState({
      activeNavItemName: 'null'
    })
  }
}

  isLoggedIn() {
    if (localStorage.token) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.props.history.push('/');
  }

  render() {
    let buttons = this.isLoggedIn() ?  <div className="actions">
            <a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/courses/get-advice" className="button-primary">GET ADVICE</a>
            <button onClick={() => {this.logout()}} className="button-primary">LOGOUT</button>
          </div> : <div className="actions">
              <a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/courses/get-advice" className="button-primary">GET ADVICE</a>
            </div>

  return (
  <header className="main-navigation">
    <nav className="nav-wrapper">
      <Link to='/dashboard' className="galvanize-logo"><img id="logo" alt="Galvanize Logo" src="https://s3-us-west-2.amazonaws.com/galvanize.com-dev/galvanize-logo.svg"></img></Link>
        <div className="nav-toggle" onClick={() => this.toggleMobileNav()}><i className="fa fa-bars fa-lg"></i></div>
        <div className={this.state.mobileNav ? "nav-items -open" : "nav-items"}>
          <li data-tag="Courses" className={this.state.activeNavItemName === "Courses" ? "nav-item -open" : "nav-item"} onClick={(e) => this.toggleMobileNavItem(e)}>Courses<span className="caret"></span>
          <ul className="list">
            <span className="diagonal"></span>
            <li className="nav-item-subheader"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/full-time">Immersive Courses</a><span><img src="https://s3-us-west-2.amazonaws.com/dotcom-files/arrow-01.png" alt=""></img></span>
              <ul>
                <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/web-development">Software Engineering</a></li>
                <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/remote-software-engineering">Remote Software Engineering</a></li>
                <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/part-time-remote-software-engineering">Part-Time Remote Software Engineering</a></li>
                <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/data-science">Data Science</a></li>
            </ul>
            </li>
            <li className="nav-item-subheader">Online Prep Courses
              <ul>
                <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/web-development/prep">Software Engineering</a></li>
                <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/data-science/prep">Data Science</a></li>
              </ul>
            </li>
          </ul>
        </li>
        <li data-tag="Campuses" className={this.state.activeNavItemName === "Campuses" ? "nav-item -open" : "nav-item"} onClick={(e) => this.toggleMobileNavItem(e)}>Campuses<span className="caret"></span>
          <ul className="list">
            <span className="diagonal"></span>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/austin">Austin</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/boulder">Boulder</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/denver-golden-triangle">Denver (Golden Triangle)</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/denver-platte">Denver (Platte)</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/los-angeles">Los Angeles</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/new-york">New York</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/phoenix">Phoenix</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/san-francisco">San Francisco</a></li>
            <li className="nav-list-item"><a target="_blank" rel="noopener noreferrer" href="https://www.galvanize.com/campuses/seattle">Seattle</a></li>
          </ul>
        </li>
        { buttons }
      </div>
    </nav>
  </header>
    )
  }
}

export default withRouter(Header);
