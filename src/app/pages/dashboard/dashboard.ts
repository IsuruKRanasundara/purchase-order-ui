import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../../services/dashboard';
import { apiError } from '../../services/api-error';
import { OrderSummary, OldestItem, ItemQuantity } from '../../models/purchase-order';
import { LatestOrders } from '../../components/latest-orders/latest-orders';
import { OldestOrderItems } from '../../components/oldest-order-items/oldest-order-items';
import { ItemDonutChart } from '../../components/item-donut-chart/item-donut-chart';
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe, LatestOrders, OldestOrderItems, ItemDonutChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly service = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly updated = signal('');
  readonly latest = signal<OrderSummary[]>([]);
  readonly oldest = signal<OldestItem[]>([]);
  readonly quantities = signal<ItemQuantity[]>([]);
  get totalQuantity() {
    return this.quantities().reduce((sum, item) => sum + item.quantity, 0);
  }
  ngOnInit() {
    this.refresh();
  }
  refresh() {
    this.loading.set(true);
    this.error.set('');
    this.service
      .load()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.latest.set(data.latest);
          this.oldest.set(data.oldest);
          this.quantities.set(data.quantities);
          this.updated.set(
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          );
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(apiError(error));
          this.loading.set(false);
        },
      });
  }
}
