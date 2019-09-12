import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';
import InterviewSidebar from '../components/book-interview-sidebar';
import TIBookingTool from '../components/booking-tool-ti';

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
      console.log('true!');
      this.setState({
        showTI: false,
        showTAA: true
      })
    }
  }

  // <Breadcrumb
  //   previousComponent={this.hideIframe}
  //   refreshData={!this.state.isLoading && this.state.showIframe}
  //   text={(!this.state.isLoading && this.state.showIframe) || this.state.isLoading ? 'Select a Different Calendar' : 'Back to Dashboard'}
  //   linkUrl={(!this.state.isLoading && this.state.showIframe) || this.state.isLoading ? null : '/dashboard'}/>

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
                    <button className="button-primary" onClick={() => this.loadBookingTool('TI')}>Book TI</button>
                    <button className="button-primary" onClick={() => this.loadBookingTool('TAA')}>Book TAA</button>
                  </>
                 }
                { this.state.showTI &&
                  <TIBookingTool opp={this.state.opp} user={this.props.user}/>
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
