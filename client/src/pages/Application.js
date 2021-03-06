import React, { Component } from 'react';
import { Prompt, withRouter } from 'react-router-dom';
import Joi from 'joi';
import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';
import Checkbox from '../components/forms/checkbox';
import InputGroup from '../components/forms/input-group';
import Label from '../components/forms/label';
import Select from '../components/forms/select';
import Schema from '../helpers/validations';
import LoadingWheel from '../components/base/LoadingWheel';

import utils from '../helpers/utils';

import { APPLICATION_INPUTS } from '../components/forms/inputs/application-inputs';
import { APPLICATIONS_ENDPOINT, APPLICATION_INITIALIZE_ENDPOINT } from '../constants';

class Application extends Component {
  constructor(props){
    super(props);

    let program = {};
    let inputs, values, courseType;
    if (props.location.state) {
      program = props.location.state.program ? props.location.state.program : props.location.state.opp;
      if(program.course_product) program.courseProduct = program.course_product;
      if(program.courseProduct === 'Web Development') program.courseProduct = 'Full Stack';
      if(program.course_type) program.courseType = program.course_type;
      courseType = program.courseType === '18 Week Full-Time Immersive' ? '12 Week Full-Time Immersive' : program.courseType;
      inputs = APPLICATION_INPUTS.find(app => (
        (app.courseProduct === program.courseProduct) && (app.courseType === courseType)
      ));
      if (inputs) {
        values = inputs.formFields.reduce((result, currentVal) => {
          result[currentVal["fieldName"]] = '';
          return result
        }, {});
      }
    }

    this.state = {
      campus: '',
      program: program,
      courseType: courseType,
      courseProduct: program.courseProduct,
      admissionsProcess: program.admissionsProcess,
      steps: inputs ? inputs.formFields: [],
      values: values,
      errors: {},
      isLoading: true,
      submitAttempted: false,
      saveButtonText: 'Save',
      errorText: null,
      unsavedChanges: false,
      savingApp: false,
      submittingApp: false,
      showFirstPage: true,
      pageSliceValue: 8
    };
  }

  componentDidMount() {
    if (!this.state.courseType || !this.state.courseProduct || !this.state.values) return this.props.history.push('/dashboard');
    const endpoint = `${APPLICATION_INITIALIZE_ENDPOINT}/type/${encodeURIComponent(this.state.courseType)}/product/${encodeURIComponent(this.state.courseProduct)}`
    let campus;

    if (this.props.location.state && this.props.location.state.campus) campus = this.props.location.state.campus;
    if (this.props.location.state.opp && this.props.location.state.opp.values && this.props.location.state.opp.values.Campus__c) campus = this.props.location.state.opp.values.Campus__c;
    this.setState({campus:campus})

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Campus__c: campus,
      })
    })
      .then(resp => resp.json())
      .then((resp) => {
        if (resp.message === 'jwt expired' || resp.message === 'jwt malformed' || resp.message === 'Your session has expired. Please log back in.') {
          this.props.clearData()
        }
        if (resp.complete) return this.props.history.push(`/dashboard?conv=app_complete&prod=${utils.conversionQuery(this.state.courseProduct)}`);
        if (resp.values) {
          Object.keys(resp.values).forEach(key => this.checkDependencies(key, resp.values[key]));
          this.setState((prevState) => ({ values: {...prevState.values, ...resp.values }, applicationId: resp.id, isLoading: false }) )
        }
      })

    if (this.props.location.state && this.props.location.state.lead) {
      const { lead } = this.props.location.state;
      this.setState({lead: lead})
    }
  }

  componentDidUpdate() {
    if (this.state.unsavedChanges) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  checkDependencies = (fieldName, value) => {
    // check dependencies
    this.state.steps.forEach((step) => {
      if (step.dependentField === fieldName) {
        step.dependentProcess(value, this.state.courseType, this.state.courseProduct)
          .then((options) => {
            // only using for select, so update options
            this.setState(prevState => ({
              ...prevState,
              values: {
                ...prevState.values,
                [step.fieldName]: ''
              },
              steps: this.state.steps.map((s) => { return s.id === step.id ? Object.assign({}, s, { options }): s })
            }))
          })
      }
    })
  }

  onInputChange = (fieldName, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.checkDependencies(fieldName, value);
    this.setState(prevState => ({
      ...prevState,
      values: {
        ...prevState.values,
        [fieldName]: value
      },
      unsavedChanges: true
    }), () => {
      const saveOnChange = this.state.steps.reduce((ret, curr) => ret = ret || (curr.saveOnChange && curr.fieldName === fieldName), false);
      if (saveOnChange) this.persistApp(null);
    });
  }

  invalidValues = (range) => {
    const errors = {};
    let steps = this.state.steps;
    if (range) steps = this.state.steps.slice(0, this.state.pageSliceValue)
    steps.forEach((step) => {
      const validationSet = step.validate.reduce((result, currentVal) => {
        result[currentVal] = this.state.values[step.fieldName]
        return result
      }, {})

      const validation = Joi.validate(validationSet, Schema)

      if (validation.error !== null) errors[step.id] = step.errorMsg;
    });
    this.setState({ errors });

    return Object.keys(errors).length > 0
  }

  persistApp(complete) {
    this.setState({ unsavedChanges: false })

    return fetch(`${APPLICATIONS_ENDPOINT}/${this.state.applicationId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        values: this.state.values,
        courseType: this.state.courseType,
        courseProduct: this.state.courseProduct,
        complete,
      })
    })
  }

  onSave = () => {
    this.setState({ errorText: null, savingApp: true });
    this.persistApp(null)
      .then(resp => resp.json())
      .then((resp) => {
        if (resp.message === 'jwt expired' || resp.message === 'jwt malformed' || resp.message === 'Your session has expired. Please log back in.') {
          return this.props.clearData()
        }
        this.setState({ savingApp: false, saveButtonText: 'Saved!' });
        setTimeout(() => {
          this.setState({ saveButtonText: 'Save' });
        }, 1000)
      })
      .catch((err) => {
        this.setState({ errorText: 'Something has gone wrong, please contact support@galvanize.com' });
      })
  }

  onSubmit = () => {
    this.setState({ errorText: null, submitAttempted: true });
    if (this.invalidValues()) return;
    this.setState({ submittingApp: true });
    this.persistApp(new Date())
      .then(resp => {
        if (!resp.ok) throw new Error("HTTP status " + resp.status);
        return resp.json()
      })
      .then((result) => {
        this.props.history.push({
        pathname: `/dashboard`,
        search: `?conv=app_complete&prod=${utils.conversionQuery(this.state.courseProduct)}`,
        state: { dataRefresh: true }
        })
      })
      .catch((_err) => {
        this.setState({ submittingApp: false, errorText: 'Something has gone wrong, please contact support@galvanize.com' });
      })
  }

  goToNextStep = () => {
    if (this.invalidValues(this.state.pageSliceValue)) return;
    this.setState({ showFirstPage: false });
  }

  goToFirstStep = () => {
    this.setState({ showFirstPage: true });
  }

  renderSelect(input, i) {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Select
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          value={this.state.values[input.fieldName]}
          options={input.options}
          onOptionClick={(e) => this.onInputChange(input.fieldName, e)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
          disabled={input.dependentField ? !this.state.values[input.dependentField] : false}
        />
      </div>
    )
  }

  renderText(input, i) {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Label text={input.label}/>
        <InputGroup
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          placeholder={input.placeholder}
          value={this.state.values[input.fieldName]}
          onInputChange={(e) => this.onInputChange(input.fieldName, e)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
        />
      </div>
    )
  }

  renderTextarea(input, i) {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Label text={input.label}/>
        <InputGroup
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          value={this.state.values[input.fieldName]}
          onInputChange={(e) => this.onInputChange(input.fieldName, e)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
          charCount={this.state.values[input.fieldName].length}
        />
      </div>
    )
  }

  renderCheckbox(input, i) {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Checkbox
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          terms={input.id === "terms"}
          checked={this.state.values[input.fieldName]}
          onInputChange={(e) => this.onInputChange(input.fieldName, e)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
        />
      </div>
    )
  }

  renderSteps() {
    let inputs = this.state.steps.map((input,i) => {
      switch (input.type) {
        case "text":
          return this.renderText(input, i)
        case "select":
          return this.renderSelect(input, i)
        case "textarea":
          return this.renderTextarea(input, i)
        case "checkbox":
          return this.renderCheckbox(input, i)
        default:
          return this.renderText(input, i)
      }
    })

    return {firstPage: inputs.slice(0, this.state.pageSliceValue), secondPage: inputs.slice(this.state.pageSliceValue)}
  }


  render() {
    return (
      <>
        <Prompt message="You have unsaved changes, are you sure you want to leave?" when={this.state.unsavedChanges} />
        <div className="application-steps">
          <div className="container">
            <div className="portal-inner">
              <Hero
                headline={'Complete Your Application'}
                description={this.state.program.formalName}
              />
              <Breadcrumb refreshData={true} />
              <div className="application-form">
                {!this.state.isLoading ?
                  <>
                  <p className="header-description">
                  This application takes just a few minutes to complete. After submitting your application, you’ll be taken back to the dashboard to complete the rest of the admissions process. You can always click &quot;Save&quot; and come back to finish later.</p>
                {this.state.showFirstPage ? this.renderSteps().firstPage : this.renderSteps().secondPage}
                  {this.state.errorText && <p className="error-msg">{this.state.errorText}</p>}

                  { this.state.showFirstPage ?
                    <div className="action">
                      <button id="save" type="submit" onClick={this.onSave} className={this.state.savingApp ? "button-secondary -loading" : "button-secondary"}>{this.state.saveButtonText}</button>
                      <button type="submit" onClick={this.goToNextStep} className="button-primary">Next</button>
                    </div> :
                    <div className="action">
                      <button type="submit" onClick={this.goToFirstStep} className="button-secondary">Back</button>
                      <button id="save" type="submit" onClick={this.onSave} className={this.state.savingApp ? "button-secondary -loading" : "button-secondary"}>{this.state.saveButtonText}</button>
                      <button type="submit" onClick={this.onSubmit} className={this.state.submittingApp ? "button-primary -loading" : "button-primary"}>Submit Application</button>
                    </div>
                  }

                  </>:
                  <div className="program-select column-headline">
                    <h4 className="column-headline">Loading your application...</h4>
                    <LoadingWheel/>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Application);
