import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDonutChart } from './item-donut-chart';

describe('ItemDonutChart', () => {
  let component: ItemDonutChart;
  let fixture: ComponentFixture<ItemDonutChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDonutChart],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDonutChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
