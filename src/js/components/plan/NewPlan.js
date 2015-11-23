import Formsy from 'formsy-react';
import React from 'react';

import PlanFileInput from './PlanFileInput';
import PlanNameInput from './PlanNameInput';
import FileList from './FileList';
import FormErrorList from '../ui/forms/FormErrorList';
import NotificationActions from '../../actions/NotificationActions';
import TripleOApiErrorHandler from '../../services/TripleOApiErrorHandler';
import TripleOApiService from '../../services/TripleOApiService';

export default class NewPlan extends React.Component {

  constructor() {
    super();
    this.state = {
      name: undefined,
      files: [],
      canSubmit: false,
      formErrors: []
    };
  }

  onNameChange(e) {
    this.setState({name: e.target.value});
  }

  onPlanFilesChange(e) {
    let files = [];
    for(let i=0, l=e.target.files.length; i<l; i++) {
      let reader = new FileReader();
      let file = e.target.files[i];
      if(file.name.match(/(\.yaml|\.json)$/)) {
        reader.onload = (f => {
          return e => {
            let obj = {
              name: f.webkitRelativePath.replace(/^[^\/]*\//, ''),
              content: e.target.result
            };
            files.push(obj);
            this.setState({files: files});
          };
        }(file));
        reader.readAsText(file);
      }
    }
  }

  onFormSubmit(form) {
    let planFiles = {};
    this.state.files.forEach(item => {
      planFiles[item.name] = {};
      planFiles[item.name].contents = item.content;
      // TODO(jtomasek): user can identify capabilities-map in the list of files
      // (dropdown select or sth)
      if(item.name === 'capabilities_map.yaml') {
        planFiles[item.name].meta = { 'file-type': 'capabilities-map' };
      }
    });

    TripleOApiService.createPlan(this.state.name, planFiles).then(result => {
      this.props.history.pushState(null, 'plans/list');
      NotificationActions.notify({
        title: 'Plan Created',
        message: `The plan ${this.state.name} was successfully created.`,
        type: 'success'
      });
    }).catch(error => {
      console.error('Error in TripleOApiService.createPlan', error);
      let errorHandler = new TripleOApiErrorHandler(error);
      errorHandler.errors.forEach((error) => {
        NotificationActions.notify({
          title: 'Error Creating Plan',
          message: `The plan ${this.state.name} could not be created. ${error.message}`,
          type: 'error'
        });
      });
    });
  }

  onFormValid() {
    this.setState({canSubmit: true});
  }

  onFormInvalid() {
    this.setState({canSubmit: false});
  }

  render () {
    return (
      <div className="new-plan">
        <div className="blank-slate-pf clearfix">
          <div className="blank-slate-pf-icon">
            <i className="fa fa-plus"></i>
          </div>
          <h1>Create New Plan</h1>
          <FormErrorList errors={this.state.formErrors}/>
          <Formsy.Form ref="NewPlanForm"
                       role="form"
                       className="form new-plan-form col-sm-6 col-sm-offset-3"
                       onValidSubmit={this.onFormSubmit.bind(this)}
                       onValid={this.onFormValid.bind(this)}
                       onInvalid={this.onFormInvalid.bind(this)}>
            <div className="form-group">
              <PlanNameInput id="PlanName"
                     name="PlanName"
                     placeholder="Add a Plan Name"
                     onChange={this.onNameChange.bind(this)}
                     validations={{matchRegexp: /^[A-Za-z0-9_-]+$/}}
                     validationError="Please use only alphanumeric characters and - or _"
                     required />
            </div>
            <div className="form-group">
                <PlanFileInput onChange={this.onPlanFilesChange.bind(this)}
                           name="PlanFiles"
                           label="Plan Files"
                           validations="hasPlanFiles"
                           multiple/>
            </div>
            <div className="blank-slate-pf-main-action">
              <button disabled={!this.state.canSubmit}
                      className="btn btn-primary btn-lg"
                      type="submit">
                Upload Files and Create Plan
              </button>
            </div>
          </Formsy.Form>
        </div>
        <FileList files={this.state.files} />
      </div>
    );
  }
}

NewPlan.propTypes = {
  history: React.PropTypes.object
};

Formsy.addValidationRule('hasPlanFiles', function (values, value) {
  if(value && value.length > 0) {
    return true;
  }
  return false;
});