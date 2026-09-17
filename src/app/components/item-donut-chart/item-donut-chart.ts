import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ItemQuantity } from '../../models/purchase-order';
@Component({
  selector: 'app-item-donut-chart',
  imports: [DecimalPipe],
  templateUrl: './item-donut-chart.html',
  styleUrl: './item-donut-chart.scss',
})
export class ItemDonutChart {
  readonly items = input<ItemQuantity[]>([]);
  readonly colors = [
    '#00a8c9',
    '#008aac',
    '#005575',
    '#20c968',
    '#5e7ee5',
    '#b482d9',
    '#f5b54a',
    '#ef7c83',
  ];
  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly gradient = computed(() => {
    let start = 0;
    return (
      'conic-gradient(' +
      this.items()
        .map((item, i) => {
          const end = start + (item.quantity / this.total()) * 100;
          const segment = this.colors[i % this.colors.length] + ' ' + start + '% ' + end + '%';
          start = end;
          return segment;
        })
        .join(',') +
      ')'
    );
  });
}
