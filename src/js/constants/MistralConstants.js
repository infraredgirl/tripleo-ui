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

export default {
  BAREMETAL_INTROSPECT: 'tripleo.baremetal.v1.introspect',
  BAREMETAL_MANAGE: 'tripleo.baremetal.v1.manage',
  BAREMETAL_PROVIDE: 'tripleo.baremetal.v1.provide',
  BAREMETAL_REGISTER_OR_UPDATE: 'tripleo.baremetal.v1.register_or_update',
  CAPABILITIES_GET: 'tripleo.heat_capabilities.get',
  CAPABILITIES_UPDATE: 'tripleo.heat_capabilities.update',
  CREATE_CONTAINER: 'tripleo.plan.create_container',
  DEPLOYMENT_DEPLOY_PLAN: 'tripleo.deployment.v1.deploy_plan',
  PARAMETERS_GET: 'tripleo.parameters.get_flatten',
  PARAMETERS_UPDATE: 'tripleo.parameters.update',
  PLAN_CREATE: 'tripleo.plan_management.v1.create_deployment_plan',
  PLAN_DELETE: 'tripleo.plan.delete',
  PLAN_LIST: 'tripleo.plan.list',
  PLAN_EXPORT: 'tripleo.plan_management.v1.export_deployment_plan',
  ROLE_LIST: 'tripleo.role.list',
  VALIDATIONS_LIST: 'tripleo.validations.list_validations',
  VALIDATIONS_RUN: 'tripleo.validations.v1.run_validation',
  VALIDATIONS_RUN_GROUPS: 'tripleo.validations.v1.run_groups'
};
