import { createAction, props } from '@ngrx/store';

export const setPrice = createAction(
    '[Investing] Set Price',
    props<{ price: number }>()
);

export const setQuantity = createAction(
    '[Investing] Set Quantity',
    props<{ quantity: number }>()
);

export const setCost = createAction(
    '[Investing] Set Cost',
    props<{ cost: number }>()
);
