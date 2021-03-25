import { Component, OnInit } from '@angular/core';
import { setPrice } from '../../actions/investing.actions';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';

// import { State } from '../../reducers/index'
import { State } from 'reducers/index'

@Component({
  selector: 'app-price-matrix',
  templateUrl: './price-matrix.component.html',
  styleUrls: ['./price-matrix.component.scss']
})
export class PriceMatrixComponent implements OnInit {
  f: FormGroup
  priceControl = new FormControl()
  price$: Observable<number>

  constructor(
    fb: FormBuilder,
    private store: Store<State>
  ) {
    this.f = fb.group({
      price: this.priceControl
    })
    this.price$ = store.select(state => state.investing.price);
  }

  ngOnInit(): void {
    this.priceControl.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(v => {
      this.store.dispatch(setPrice({ price: v }))
    })

    this.price$.subscribe(x => this.priceControl.setValue(x, { emitEvent: false }))
  }



}
