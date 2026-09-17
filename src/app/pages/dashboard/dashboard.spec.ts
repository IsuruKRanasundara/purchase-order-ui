import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
      imports: [Dashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('loads all three widgets from the dashboard API', () => {
    const http = TestBed.inject(HttpTestingController);
    http
      .expectOne('http://localhost:5259/api/dashboard/latest-purchase-orders')
      .flush([{ id: 1, netAmount: 10, numberOfItems: 1 }]);
    http
      .expectOne('http://localhost:5259/api/dashboard/oldest-purchase-order-items')
      .flush([{ purchaseOrderId: 1, itemName: 'Bolt', quantity: 2 }]);
    http.expectOne('http://localhost:5259/api/dashboard/item-quantities').flush([{ itemName: 'Bolt', quantity: 2 }]);
    fixture.detectChanges();
    expect(component.loading()).toBe(false);
    expect(component.totalQuantity).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Bolt');
    http.verify();
  });

  it('offers retry when the API is unavailable', () => {
    const http = TestBed.inject(HttpTestingController);
    http
      .expectOne('http://localhost:5259/api/dashboard/latest-purchase-orders')
      .flush({}, { status: 500, statusText: 'Server error' });
    fixture.detectChanges();
    expect(component.loading()).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Try again',
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
