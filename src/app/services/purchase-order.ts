import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateOrderRequest, OrderResponse } from '../models/purchase-order';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrder {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  list(page = 1, pageSize = 20) {
    return this.http.get<OrderResponse[]>(`${this.base}/purchase-orders`, {
      params: { page, pageSize },
    });
  }
  get(id: number) {
    return this.http.get<OrderResponse>(`${this.base}/purchase-orders/${id}`);
  }
  create(order: CreateOrderRequest) {
    return this.http.post<OrderResponse>(`${this.base}/purchase-orders`, order);
  }
}
