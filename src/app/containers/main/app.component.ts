import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, defaultIfEmpty, map, startWith, withLatestFrom } from 'rxjs/operators';

import { State } from 'reducers/index'
import { setCost, setPrice, setQuantity } from 'actions/investing.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  f: FormGroup
  priceControl = new FormControl()
  quantityControl = new FormControl()
  costControl = new FormControl()
  posPriceControl = new FormControl()
  posQuantityControl = new FormControl()

  price$: Observable<number>
  quantity$: Observable<number>
  cost$: Observable<number>

  combinedPrice$: Observable<number>
  combinedQuantity$: Observable<number>
  combinedCost$: Observable<number>

  get posPrice(): number {
    return this.posPriceControl.value || 0
  }

  get posQuantity(): number {
    return this.posQuantityControl.value || 0
  }

  get posCost(): number {
    return this.posPrice * this.posQuantity * 100
  }

  // get combinedCost$(): Observable<number> {
  //   return combineLatest([
  //     this.combinedPrice$, this.combinedQuantity$
  //   ]).pipe(
  //     map(([p, q]) => p * q),
  //     defaultIfEmpty(0)
  //   )
  // }

  constructor(
    fb: FormBuilder,
    private store: Store<State>
  ) {
    this.f = fb.group({
      price: this.priceControl,
      quantity: this.quantityControl,
      cost: this.costControl,
      posPrice: this.posPriceControl,
      posQuantity: this.posQuantityControl,
    })
    this.price$ = store.select(state => state.investing.price);
    this.quantity$ = store.select(state => state.investing.quantity);
    this.cost$ = store.select(state => state.investing.cost);

    this.combinedPrice$ = combineLatest([
      this.price$, this.quantity$, this.posPriceControl.valueChanges, this.posQuantityControl.valueChanges
    ]).pipe(
      map(([p, q, p2, q2]) => (p2 * q2 + p * q) / (q + q2)),
      defaultIfEmpty(0)
    )

    this.combinedQuantity$ = combineLatest([
      this.price$, this.quantity$, this.posPriceControl.valueChanges, this.posQuantityControl.valueChanges
    ]).pipe(
      map(([p, q, p2, q2]) => q + q2),
      defaultIfEmpty(0)
    )

    this.combinedCost$ = combineLatest([
      this.combinedPrice$, this.combinedQuantity$
    ]).pipe(
      map(([p, q]) => p * q * 100),
      defaultIfEmpty(0)
    )

  }

  ngOnInit(): void {
    this.priceControl.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(v => {
      this.store.dispatch(setPrice({ price: v }))
    })

    this.quantityControl.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(v => {
      this.store.dispatch(setQuantity({ quantity: v }))
    })

    this.costControl.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(v => {
      this.store.dispatch(setCost({ cost: v }))
    })

    combineLatest([
      this.price$, this.quantity$, this.cost$
    ]).subscribe(([p, q, c]) => {
      this.priceControl.setValue(p, { emitEvent: false })
      this.quantityControl.setValue(q, { emitEvent: false })
      this.costControl.setValue(c, { emitEvent: false })
    })

    // this.price$.subscribe(x => this.priceControl.setValue(x, { emitEvent: false }))
  }

  public calculatePercent(p: number): Observable<number> {
    return this.price$.pipe(
      map(v => v * (1 + p / 100))
    )
  }
}
