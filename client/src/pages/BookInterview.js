import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';
import InterviewSidebar from '../components/book-interview-sidebar';
import TIBookingTool from '../components/booking-tool-ti';
import TAABookingTool from '../components/booking-tool-taa';

import { HERO_TEXT, SEI_STEPS_12_WK } from '../constants';

class BookInterview extends Component {
  constructor(props){
    super(props);

    this.state = {
      showTI: false,
      showTAA: false
    };
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.opp) {
      const {opp} = this.props.location.state;

      if (opp.currentStep !== SEI_STEPS_12_WK.STEP_THREE && !this.props.location.override) {
        return this.props.history.push('/dashboard')
      }
      this.setState({opp: opp})
     } else {
       return this.props.history.push('/dashboard')
    }
  }

  loadBookingTool = (tool) => {
    if(tool === 'TI') {
      this.setState({
        showTI: true,
        showTAA: false
      })
    } else {
      this.setState({
        showTI: false,
        showTAA: true
      })
    }
  }

  changeToTI = () => {
    this.setState({
      showTI: true,
      showTAA: false
    })
  }

  render() {
    return (
      <div className="book-interview">
        <div className="container">
            <div className="portal-inner">
              <Hero
                headline={HERO_TEXT.SEI_BOOK_INTERVIEW.heroHeadline}
                description={HERO_TEXT.SEI_BOOK_INTERVIEW.heroDescription}
              />
              <div className="two-col">
                <div className="campus-group">
                { !this.state.showTI && !this.state.showTAA &&
                  <>
                  <Breadcrumb/>
                  <div className="pre-question">
                  <p>Have you ever taken a Software Engineering Technical Interview or Technical Admissions Assessment with Hack Reactor or Galvanize?</p>
                    <div>
                      <button className="button-primary" onClick={() => this.loadBookingTool('TAA')}>No</button>
                      <button className="button-primary" onClick={() => this.loadBookingTool('TI')}>Yes</button>
                    </div>
                  </div>
                  </>
                 }
                { this.state.showTI &&
                  <TIBookingTool opp={this.state.opp} user={this.props.user}/>
                }
                { this.state.showTAA &&
                  <TAABookingTool opp={this.state.opp} user={this.props.user} changeToTI={this.changeToTI}/>
                }
                </div>
                <InterviewSidebar/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BookInterview);
