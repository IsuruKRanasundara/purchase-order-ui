import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { API_BASE_URL } from './purchase-order';
import { ItemQuantity, OldestItem, OrderSummary } from '../models/purchase-order';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  latestOrders() { return this.http.get<OrderSummary[]>(`${this.base}/dashboard/latest-purchase-orders`); }
  oldestItems() { return this.http.get<OldestItem[]>(`${this.base}/dashboard/oldest-purchase-order-items`); }
  itemQuantities() { return this.http.get<ItemQuantity[]>(`${this.base}/dashboard/item-quantities`); }
  load() { return forkJoin({ latest: this.latestOrders(), oldest: this.oldestItems(), quantities: this.itemQuantities() }); }
}
