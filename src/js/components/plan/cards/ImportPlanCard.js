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

import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

const messages = defineMessages({
  importPlan: {
    id: 'ListPlans.importPlan',
    defaultMessage: 'Import Plan'
  }
});

const ImportPlanCard = ({ history }) => (
  <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
    <div
      className="card-pf import-plan-card card-pf-view card-pf-view-select card-pf-view-single-select"
      onClick={() => history.push(`/plans/manage/new`)}
      id="ListPlans__importPlanLink"
    >
      <div className="card-pf-body">
        <p className="text-center">
          <span className="pficon pficon-add-circle-o" />&nbsp;
          <FormattedMessage {...messages.importPlan} />
        </p>
      </div>
    </div>
  </div>
);
ImportPlanCard.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(injectIntl(ImportPlanCard));
