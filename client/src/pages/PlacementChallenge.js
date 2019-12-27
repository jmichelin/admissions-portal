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

  /*
  items needed:
    Prior to starting assessment
      userID -> to create assessment
    Once assessment started
      **required**
        assessmentID -> to maintain assessmentObject, updating db
        promptID -> to select/verify prompt (can access with promptsUsed array last index)
        answerValue -> from the input form, corresponds to the index value of the prompt content
      **feature requirements**
        number of prompts answered -> progress bar?
        current skill -> skill temp sensor?
  */

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