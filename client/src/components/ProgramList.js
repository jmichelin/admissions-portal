import React, { Component } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import AdmissionsProcessSteps from './AdmissionsProcessSteps';
import NextStepBlock from './NextStepsBlock';
import ResourcesSEI from './ResourcesSei';
import ResourcesDSI from './ResourcesDsi';

const modalStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '225px',
    width: '500px',
  }
};

class ProgramList extends Component {
  state = {
    appDeleteError: null,
    modalOpen: false,
    appForDeletion: null,
  };

  showModal = (application) => {
    this.setState({ modalOpen: true, appForDeletion: application });
  };
  
  hideModal = () => {
    this.setState({ modalOpen: false, appForDeletion: null });
  };

  deleteApplication = async (application) => {
    try {
      await fetch(`/api/v1/applications/${application.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationUserID: application.user_id }),
      });
      this.hideModal();
      this.props.getData(true);
    } catch (_err) {
      this.setState({
        appDeleteError: 'Sorry, there was an error deleting your application. Please contact dev@galvanize.com',
        modalOpen: false,
        appForDeletion: null,
      });
    }
  }

  render() {
    const { appDeleteError, modalOpen, appForDeletion } = this.state;
    const { applications } = this.props;

    return (
      <>
        <Modal
          isOpen={modalOpen}
          onRequestClose={this.hideModal}
          style={modalStyles}
          contentLabel="Application Delete Modal"
        >
          <div className="modal-content-wrapper">
            <h4>Are you sure you want to delete this application?</h4>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={this.hideModal}>
                Cancel
              </button>
              <button className="delete-button" onClick={() => this.deleteApplication(appForDeletion)}>
                Delete
              </button>
            </div>
          </div>
        </Modal>
        <div className="table">
          <div className="table-head">
            {appDeleteError && <span className="error">{appDeleteError}</span>}
            <ul className="table-row">
              <li>Your Active Applications</li>
              <li className="hide-mobile">Campus</li>
              <li className="hide-mobile">Start Date</li>
              <li className="hide-tablet">Next Step</li>
            </ul>
          </div>
          <div className="table-body">
            {applications.map((application, i) => (
              <div className="application-row" key={i}>
                {application.currentStep.step === 1 && (
                  <div className="delete-application">
                    <button onClick={() => this.showModal(application)}>
                      X
                    </button>
                  </div>
                )}
                <ul className="table-row -listing">
                  <li>{application.formalName}</li>
                  <li className="hide-mobile">{application.values ? application.values.Campus__c : application.campus}</li>
                  <li className="hide-mobile">{moment(application.courseStart).format('MM/DD/YYYY')}</li>
                  <li className="hide-tablet">{application.currentStep ? application.currentStep.status : 'Talk to Your Enrollment Officer'}</li>
                </ul>
                {i < 1 && (
                  <AdmissionsProcessSteps
                    admissionsProcess={application.admissionsProcess}
                    activeStep={application.currentStep}
                  />
                )}
                <NextStepBlock opp={application} step={application.currentStep} />
                {i < 1 && (application.courseProduct === 'Data Science' ? <ResourcesDSI /> : <ResourcesSEI />)}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default ProgramList;
