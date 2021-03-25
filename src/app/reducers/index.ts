import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as fromInvesting from './investing.reducer';

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export interface State {
  // investing: fromInvesting.State
  [fromInvesting.featureKey]: fromInvesting.State
}

export const reducers: ActionReducerMap<State> = {
  [fromInvesting.featureKey]: fromInvesting.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger] : [];
