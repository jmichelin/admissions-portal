import React from 'react';

export default (props) => {

  return (
    <div className="sidebar">
    <h4 className="column-headline">Things to Know</h4>
    <ul>
      <li>The technical interview will assess your readiness for the Data Science Immersive in terms of your ability to reason statistically using Python on data. It consists in a series of small problems that build on each other.</li>
      <li>The interview will be <span>90 minutes long.</span></li>
      <li>To ensure you can interview in time for your desired cohort, you should book an interview and start preparing immediately. Interview spots fill up quickly, and extra preparation will give you confidence.</li>
      <li>A max of three interviews is permitted.</li>
    </ul>

    <div className="card-help">
      <h4>Have Questions?</h4>
      <p>We have the answers to help you prepare for the Technical Interview.</p>
      <a className="button-secondary" href="https://www.galvanize.com/data-science/interview" rel="noopener noreferrer" target="_blank">About the Tech Interview</a>
      <h5>Contact</h5>
      <a href="mailto:admissions@galvanize.com">admissions@galvanize.com</a>
    </div>
    </div>
  )
}
