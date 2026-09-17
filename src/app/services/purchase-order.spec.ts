import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PurchaseOrder } from './purchase-order';
import { DashboardService } from './dashboard';

describe('Purchase API route contract', () => {
  let http: HttpTestingController;
  let orders: PurchaseOrder;
  let dashboard: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    orders = TestBed.inject(PurchaseOrder);
    dashboard = TestBed.inject(DashboardService);
  });

  afterEach(() => http.verify());

  it('lists orders using the documented pagination defaults', () => {
    orders.list().subscribe();
    const request = http.expectOne('http://localhost:5259/api/purchase-orders?page=1&pageSize=20');
    expect(request.request.method).toBe('GET');
    expect(request.request.body).toBeNull();
    request.flush([]);
  });

  it('passes custom pagination to the list endpoint', () => {
    orders.list(2, 10).subscribe();
    const request = http.expectOne('http://localhost:5259/api/purchase-orders?page=2&pageSize=10');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('retrieves an order by ID without a request body', () => {
    orders.get(1).subscribe();
    const request = http.expectOne('http://localhost:5259/api/purchase-orders/1');
    expect(request.request.method).toBe('GET');
    expect(request.request.body).toBeNull();
    request.flush({ id: 1 });
  });

  it('posts the supplied JSON shape and accepts the created order', () => {
    const payload = {
      supplierName: 'ABC Suppliers', orderDate: '2026-09-17', notes: 'Office supplies',
      items: [
        { itemName: 'Notebook', quantity: 3, unitPrice: 250 },
        { itemName: 'Pen', quantity: 10, unitPrice: 50 },
      ],
    };
    let result: unknown;
    orders.create(payload).subscribe(order => result = order);
    const request = http.expectOne('http://localhost:5259/api/purchase-orders');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    expect(request.request.detectContentTypeHeader()).toBe('application/json');
    const response = { ...payload, id: 1, netAmount: 1250, numberOfItems: 2 };
    request.flush(response, { status: 201, statusText: 'Created' });
    expect(result).toEqual(response);
  });

  it('loads each dashboard widget from its documented GET endpoint', () => {
    let result: unknown;
    dashboard.load().subscribe(data => result = data);
    for (const route of ['latest-purchase-orders', 'oldest-purchase-order-items', 'item-quantities']) {
      const request = http.expectOne('http://localhost:5259/api/dashboard/' + route);
      expect(request.request.method).toBe('GET');
      expect(request.request.body).toBeNull();
      request.flush([]);
    }
    expect(result).toEqual({ latest: [], oldest: [], quantities: [] });
  });
});
