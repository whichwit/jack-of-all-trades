import { createReducer, on } from '@ngrx/store';

import { InvestingActions } from './../actions';

export const featureKey = 'investing';

export interface State {
  showSidenav: boolean;
  price: number;
  quantity: number;
  cost: number;
  prevPrice: number;
  prevQuantity: number;
}

const initialState: State = {
  showSidenav: false,
  price: 1.5,
  quantity: 33,
  cost: 5000,
  prevPrice: 0,
  prevQuantity: 0,
};

export const reducer = createReducer(
  initialState,
  // Even thought the `state` is unused, it helps infer the return type
  on(InvestingActions.setPrice, (state, { price }) => ({ ...state, price: price })),
  on(InvestingActions.setQuantity, (state, { quantity }) => ({ ...state, quantity: quantity })),
  on(InvestingActions.setCost, (state, { cost }) => ({ ...state, cost: cost })),
);

