/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import {
  allPreDeploymentValidationsSuccessful
} from '../../selectors/validations';
import DeploymentConfirmation from './DeploymentConfirmation';
import DeploymentProgress from './DeploymentProgress';
import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import { getCurrentPlan, getCurrentPlanName } from '../../selectors/plans';
import {
  getCurrentStack,
  getCurrentStackDeploymentProgress
} from '../../selectors/stacks';
import {
  getEnvironmentConfigurationSummary
} from '../../selectors/environmentConfiguration';
import Loader from '../ui/Loader';
import {
  ModalPanelBackdrop,
  ModalPanel,
  ModalPanelHeader,
  ModalPanelBody,
  ModalPanelFooter
} from '../ui/ModalPanel';
import PlanActions from '../../actions/PlansActions';
import { stackStates } from '../../constants/StacksConstants';
import StacksActions from '../../actions/StacksActions';
import ValidationsActions from '../../actions/ValidationsActions';

const messages = defineMessages({
  close: {
    id: 'DeploymentDetail.close',
    defaultMessage: 'Close'
  },
  loadingStacksLoader: {
    id: 'DeploymentDetail.loadingStacksLoader',
    defaultMessage: 'Loading Stacks...'
  },
  modalTitle: {
    id: 'DeploymentDetail.modalTitle',
    defaultMessage: 'Plan {planName} deployment'
  }
});

class DeploymentDetail extends React.Component {
  renderStatus() {
    const {
      allPreDeploymentValidationsSuccessful,
      currentPlan,
      currentPlanName,
      currentStack,
      currentStackDeploymentProgress,
      currentStackResources,
      currentStackResourcesLoaded,
      deployPlan,
      environmentConfigurationSummary,
      fetchStackResources,
      runPreDeploymentValidations,
      stacksLoaded
    } = this.props;

    if (
      !currentStack ||
      currentStack.stack_status === stackStates.DELETE_COMPLETE
    ) {
      return (
        <Loader
          loaded={stacksLoaded}
          content={this.props.intl.formatMessage(messages.loadingStacksLoader)}
          height={40}
        >
          <DeploymentConfirmation
            allValidationsSuccessful={allPreDeploymentValidationsSuccessful}
            currentPlan={currentPlan}
            deployPlan={deployPlan}
            environmentSummary={environmentConfigurationSummary}
            runPreDeploymentValidations={runPreDeploymentValidations}
          />
        </Loader>
      );
    } else if (currentStack.stack_status.match(/PROGRESS/)) {
      return (
        <DeploymentProgress
          stack={currentStack}
          stackResources={currentStackResources}
          deploymentProgress={currentStackDeploymentProgress}
          stackResourcesLoaded={currentStackResourcesLoaded}
          fetchStackResources={fetchStackResources}
        />
      );
    } else if (currentStack.stack_status.match(/COMPLETE/)) {
      return (
        <DeploymentSuccess
          stack={currentStack}
          stackResources={currentStackResources}
          stackResourcesLoaded={currentStackResourcesLoaded}
        />
      );
    } else {
      return (
        <DeploymentFailure
          fetchStackResources={fetchStackResources}
          stack={currentStack}
          stackResources={currentStackResources}
          stackResourcesLoaded={currentStackResourcesLoaded}
          planName={currentPlanName}
        />
      );
    }
  }

  render() {
    const { currentPlanName } = this.props;
    return (
      <div>
        <ModalPanelBackdrop />
        <ModalPanel>
          <ModalPanelHeader>
            <Link
              to={`/plans/${currentPlanName}`}
              type="button"
              className="close"
            >
              <span aria-hidden="true" className="pficon pficon-close" />
            </Link>
            <h2 className="modal-title">
              <FormattedMessage
                {...messages.modalTitle}
                values={{ planName: currentPlanName }}
              />
            </h2>
          </ModalPanelHeader>
          <ModalPanelBody>
            {this.renderStatus()}
          </ModalPanelBody>
          <ModalPanelFooter>
            <Link
              to={`/plans/${currentPlanName}`}
              type="button"
              className="btn btn-default"
            >
              <FormattedMessage {...messages.close} />
            </Link>
          </ModalPanelFooter>
        </ModalPanel>
      </div>
    );
  }
}

DeploymentDetail.propTypes = {
  allPreDeploymentValidationsSuccessful: PropTypes.bool.isRequired,
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentProgress: PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  currentStackResourcesLoaded: PropTypes.bool.isRequired,
  deployPlan: PropTypes.func.isRequired,
  environmentConfigurationSummary: PropTypes.string,
  fetchStackResources: PropTypes.func.isRequired,
  intl: PropTypes.object,
  runPreDeploymentValidations: PropTypes.func.isRequired,
  stacksLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    allPreDeploymentValidationsSuccessful: allPreDeploymentValidationsSuccessful(
      state
    ),
    currentPlan: getCurrentPlan(state),
    currentPlanName: getCurrentPlanName(state),
    currentStack: getCurrentStack(state),
    currentStackDeploymentProgress: getCurrentStackDeploymentProgress(state),
    currentStackResources: state.stacks.resources,
    currentStackResourcesLoaded: state.stacks.resourcesLoaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    stacksLoaded: state.stacks.isLoaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName)),
    fetchStackResources: stack =>
      dispatch(StacksActions.fetchResources(stack.stack_name, stack.id)),
    runPreDeploymentValidations: planName =>
      dispatch(
        ValidationsActions.runValidationGroups(['pre-deployment'], planName)
      )
  };
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentDetail)
);
