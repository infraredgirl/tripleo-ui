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

import when from 'when';

import * as utils from '../../js/services/utils';
import HeatApiService from '../../js/services/HeatApiService';
import StacksActions from '../../js/actions/StacksActions';

// Use these to mock asynchronous functions which return a promise.
// The promise will immediately resolve/reject with `data`.
let createResolvingPromise = data => {
  return () => {
    return when.resolve(data);
  };
};

let createRejectingPromise = errorMessage => {
  return () => {
    return when.reject(Error(errorMessage));
  };
};

describe('StacksActions', () => {
  beforeEach(() => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
  });

  describe('fetchStacks (success)', () => {
    const serviceResponse = {
      stacks: [{ stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }]
    };
    const normalizedStacks = {
      overcloud: { stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }
    };

    beforeEach(done => {
      spyOn(HeatApiService, 'getStacks').and.callFake(
        createResolvingPromise(serviceResponse)
      );
      spyOn(StacksActions, 'fetchStacksPending');
      spyOn(StacksActions, 'fetchStacksSuccess');
      spyOn(StacksActions, 'fetchStacksFailed');
      StacksActions.fetchStacks()(() => {}, () => {});
      setTimeout(() => {
        done();
      }, 1);
    });

    it('dispatches fetchStacksPending', () => {
      expect(StacksActions.fetchStacksPending).toHaveBeenCalled();
    });

    it('does not dispatch fetchStacksFailed', () => {
      expect(StacksActions.fetchStacksFailed).not.toHaveBeenCalled();
    });

    it('dispatches fetchStacksSuccess', () => {
      expect(StacksActions.fetchStacksSuccess).toHaveBeenCalledWith(
        normalizedStacks
      );
    });
  });

  describe('fetchStacks (failed)', () => {
    beforeEach(done => {
      spyOn(HeatApiService, 'getStacks').and.callFake(
        createRejectingPromise('failed')
      );
      spyOn(StacksActions, 'fetchStacksPending');
      spyOn(StacksActions, 'fetchStacksSuccess');
      spyOn(StacksActions, 'fetchStacksFailed');
      StacksActions.fetchStacks()(() => {}, () => {});
      setTimeout(() => {
        done();
      }, 1);
    });

    it('dispatches fetchStacksPending', () => {
      expect(StacksActions.fetchStacksPending).toHaveBeenCalled();
    });

    it('does not dispatch fetchStacksSuccess', () => {
      expect(StacksActions.fetchStacksSuccess).not.toHaveBeenCalled();
    });

    it('dispatches fetchStacksFailed', () => {
      expect(StacksActions.fetchStacksFailed).toHaveBeenCalled();
    });
  });
});
