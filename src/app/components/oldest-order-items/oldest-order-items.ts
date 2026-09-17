import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OldestItem } from '../../models/purchase-order';
@Component({
  selector: 'app-oldest-order-items',
  imports: [DecimalPipe],
  templateUrl: './oldest-order-items.html',
  styleUrl: './oldest-order-items.scss',
})
export class OldestOrderItems {
  readonly items = input<OldestItem[]>([]);
}
