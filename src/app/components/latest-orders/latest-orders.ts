import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderSummary } from '../../models/purchase-order';
@Component({
  selector: 'app-latest-orders',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './latest-orders.html',
  styleUrl: './latest-orders.scss',
})
export class LatestOrders {
  readonly orders = input<OrderSummary[]>([]);
}
