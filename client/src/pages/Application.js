import React, { Component } from 'react';
import { Prompt, withRouter } from 'react-router-dom';
import Joi from 'joi';
import AdmissionsProcessSteps from '../components/admissions-process-steps';
import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';
import Checkbox from '../components/forms/checkbox';
import InputGroup from '../components/forms/input-group';
import Label from '../components/forms/label';
import Select from '../components/forms/select';
import Schema from '../helpers/validations';
import { APPLICATION_INPUTS } from '../components/forms/inputs/application-inputs';
import {
  APPLICATIONS_ENDPOINT,
  APPLICATION_INITIALIZE_ENDPOINT
} from '../constants';

class Application extends Component {
  constructor(props){
    super(props);

    const inputs = APPLICATION_INPUTS[0]
    const values = inputs.formFields.reduce((result, currentVal) => {
      result[currentVal["fieldName"]] = '';
      return result
    }, {});

    let program = {};
    if (props.location.state) {
      program = props.location.state.program ? props.location.state.program : props.location.state.opp
    }

    this.state = {
      campus: '',
      courseType: program.courseType || program.course_type,
      courseProduct: program.courseProduct|| program.course_product,
      admissionsProcess: program.admissionsProcess,
      steps: inputs.formFields,
      values: values,
      errors: {},
      submitAttempted: false,
      saveButtonText: 'Save',
      errorText: null,
      unsavedChanges: false,
    };
  }

  componentDidMount() {
    if (!this.state.courseType || !this.state.courseProduct) return this.props.history.push('/dashboard')

    const endpoint = `${APPLICATION_INITIALIZE_ENDPOINT}/type/${encodeURIComponent(this.state.courseType)}/product/${encodeURIComponent(this.state.courseProduct)}`
    let campus;

    if (this.props.location.state && this.props.location.state.campus) campus = this.props.location.state.campus;
    if (this.props.location.state.opp && this.props.location.state.opp.values && this.props.location.state.opp.values.Campus__c) campus = this.props.location.state.opp.values.Campus__c;


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
        if (resp.complete) return this.props.history.push('/dashboard');
        if (resp.values) {
          Object.keys(resp.values).forEach(key => this.checkDependencies(key, resp.values[key]));
          this.setState((prevState) => ({ values: {...prevState.values, ...resp.values }, applicationId: resp.id }) )
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
        step.dependentProcess(value)
          .then((options) => {
            // only using for select, so update options
            this.setState({
              steps: this.state.steps.map((s) => { return s.id === step.id ? Object.assign({}, s, { options }): s })
            })
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

  invalidValues = () => {
    const errors = {};

    this.state.steps.forEach((step) => {
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
    this.setState({ errorText: null });
    this.persistApp(null)
      .then(resp => resp.json())
      .then(() => {
        this.setState({ saveButtonText: 'Saved!' });
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

    this.persistApp(new Date())
      .then(resp => resp.json())
      .then(() => this.props.history.push({
        pathname: '/dashboard',
        state: { dataRefresh: true }
      }))
      .catch((err) => {
        this.setState({ errorText: 'Something has gone wrong, please contact support@galvanize.com' });
      })
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
          checked={this.state.values[input.fieldName]}
          onInputChange={(e) => this.onInputChange(input.fieldName, e)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
        />
      </div>
    )
  }

  renderSteps() {
    return this.state.steps.map((input,i) => {
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
                description={''}
              />
              <Breadcrumb refreshData={true} />
              <AdmissionsProcessSteps admissionsProcess={this.state.admissionsProcess} />
              <p className="come-back-message">
                You can always click &quot;Save&quot; and come back to finish at a later time...
              </p>
              <div className="application-form">
                {this.renderSteps()}
                <div className="action">
                  <button className="button-secondary" type="submit" onClick={this.onSave}>{this.state.saveButtonText}</button>
                  <button className="button-primary" type="submit" onClick={this.onSubmit}>Submit</button>
                </div>
              </div>
              {this.state.errorText && <p className="error-msg">{this.state.errorText}</p>}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(Application);
