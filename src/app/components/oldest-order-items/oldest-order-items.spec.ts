import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldestOrderItems } from './oldest-order-items';

describe('OldestOrderItems', () => {
  let component: OldestOrderItems;
  let fixture: ComponentFixture<OldestOrderItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
      imports: [OldestOrderItems],
    }).compileComponents();

    fixture = TestBed.createComponent(OldestOrderItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
