import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestOrders } from './latest-orders';

describe('LatestOrders', () => {
  let component: LatestOrders;
  let fixture: ComponentFixture<LatestOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
