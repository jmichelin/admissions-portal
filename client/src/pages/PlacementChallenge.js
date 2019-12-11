import React, { Component } from 'react';
import Hero from '../components/hero';
import {
  HERO_TEXT
} from '../constants';


class PlacementChallenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
john : false
    }
  };

  render(){
    return ( <div className="coding-challenge">
        <div className="container">
          <div className="portal-inner">
            <Hero
              headline={HERO_TEXT.PYTHON_CHALLENGE.heroHeadline}
              description={HERO_TEXT.PYTHON_CHALLENGE.heroDescription}
            />
    <h1> Hello ?</h1>
    </div>
  </div>
</div>)
  }
}

export default PlacementChallenge