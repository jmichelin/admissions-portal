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
  APPLICATION_STEPS_SEI_12WK,
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

    let program = JSON.parse(props.location.state.program)
    this.state = {
      courseType: program.courseType,
      courseProduct: program.courseProduct,
      steps: inputs.formFields,
      values: values,
      errors: {},
      submitAttempted: false,
      saveButtonText: 'Save',
      errorText: null,
      unsavedChanges: false
    };
  }

  componentDidMount() {
    let endpoint = `${APPLICATION_INITIALIZE_ENDPOINT}/type/${encodeURIComponent(this.state.courseType)}/product/${encodeURIComponent(this.state.courseProduct)}`
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Accept': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then((resp) => {
        if (resp.complete) return this.props.history.push('/coding-challenge');
        if (resp.values) {
          Object.keys(resp.values).forEach(key => this.checkDependencies(key, resp.values[key]));
          this.setState((prevState) => ({ values: {...prevState.values, ...resp.values } }) )
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
        step.dependentProcess(value).then((options) => {
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
    this.setState({unsavedChanges: false})
    return fetch(APPLICATIONS_ENDPOINT, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        values: this.state.values,
        course_type: this.state.courseType,
        course_product: this.state.courseProduct,
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
        }, 2000)
      })
      .catch((err) => {
        this.setState({ errorText: 'Something has gone wrong, please contact support@galvanize.com' });
      })
  }

  onSubmit = () => {
    this.setState({ errorText: null });
    this.setState({ submitAttempted: true });
    if (this.invalidValues()) return;

    this.persistApp(new Date())
      .then(resp => resp.json())
      .then(() => this.props.history.push('/dashboard'))
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
    const fakeOpp = { admissionsProcess: APPLICATION_STEPS_SEI_12WK, currentStep: 1 };

    return (
      <>
        <Prompt message="You have unsaved changes, are you sure you want to leave?" when={this.state.unsavedChanges} />
        <div className="application-steps">
          <div className="container">
            <div className="portal-inner">
              <Hero headline={'Complete Your Application'} description={(this.state.courseType ? `${this.state.courseProduct} - ${this.state.courseType}` : 'Software Engineering Immersive')}/>
              <Breadcrumb />
              <AdmissionsProcessSteps opp={fakeOpp} />
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

function getUrlVars() {
  var vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      vars[key] = value;
  });
  return vars;
}

export default withRouter(Application);
