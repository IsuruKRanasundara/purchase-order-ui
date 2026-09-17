import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderForm } from './purchase-order-form';

describe('PurchaseOrderForm', () => {
  let component: PurchaseOrderForm;
  let fixture: ComponentFixture<PurchaseOrderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
      imports: [PurchaseOrderForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('rejects whitespace names, fractional quantities, and prices with excess precision', () => {
    component.form.patchValue({
      supplierName: '  ',
      items: [{ itemName: ' ', quantity: 1.5, unitPrice: 2.345 }],
    });
    component.save();
    expect(component.form.invalid).toBe(true);
    TestBed.inject(HttpTestingController).expectNone('http://localhost:5259/api/purchase-orders');
  });

  it('saves trimmed data once and clears the form after success', () => {
    component.form.patchValue({
      supplierName: ' Acme ',
      orderDate: '2026-09-17',
      notes: ' Test ',
      items: [{ itemName: ' Bolt ', quantity: 3, unitPrice: 2.5 }],
    });
    expect(component.total).toBe(7.5);
    component.save();
    component.save();
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('http://localhost:5259/api/purchase-orders');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.supplierName).toBe('Acme');
    expect(request.request.body.items[0].itemName).toBe('Bolt');
    request.flush({ id: 42 });
    expect(component.savedId()).toBe(42);
    expect(component.form.controls.supplierName.value).toBe('');
    expect(component.items.length).toBe(1);
    http.verify();
  });

  it('preserves entered data and re-enables the form when saving fails', () => {
    component.form.patchValue({
      supplierName: 'Acme',
      items: [{ itemName: 'Bolt', quantity: 2, unitPrice: 5 }],
    });
    component.save();
    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:5259/api/purchase-orders')
      .flush({}, { status: 500, statusText: 'Server error' });
    expect(component.error()).toContain('try again');
    expect(component.form.enabled).toBe(true);
    expect(component.form.controls.supplierName.value).toBe('Acme');
    expect(component.saving()).toBe(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
