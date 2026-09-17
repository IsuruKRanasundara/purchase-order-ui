import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PurchaseOrder } from '../../services/purchase-order';
import { apiError } from '../../services/api-error';
@Component({
  selector: 'app-purchase-order-form',
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './purchase-order-form.html',
  styleUrl: './purchase-order-form.scss',
})
export class PurchaseOrderForm {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly service = inject(PurchaseOrder);
  private readonly destroyRef = inject(DestroyRef);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly savedId = signal<number | null>(null);
  submitted = false;
  private today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  private createItem() {
    return this.fb.group({
      itemName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(1000000),
          Validators.pattern(/^\d+$/),
        ],
      ],
      unitPrice: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(1000000),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
    });
  }
  readonly form = this.fb.group({
    supplierName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    orderDate: [
      this.today(),
      [Validators.required, Validators.pattern(/^(?!0000)\d{4}-\d{2}-\d{2}$/)],
    ],
    notes: ['', Validators.maxLength(2000)],
    items: this.fb.array([this.createItem()]),
  });
  get items() {
    return this.form.controls.items;
  }
  get total() {
    return this.items.controls.reduce(
      (sum, item) =>
        sum + this.lineTotal(item.getRawValue().quantity, item.getRawValue().unitPrice),
      0,
    );
  }
  lineTotal(quantity: number, price: number) {
    return Math.round((Number(quantity) || 0) * (Number(price) || 0) * 100) / 100;
  }
  addItem() {
    if (this.items.length < 500) this.items.push(this.createItem());
  }
  removeItem(index: number) {
    if (this.items.length > 1) this.items.removeAt(index);
  }
  save() {
    if (this.saving()) return;
    this.submitted = true;
    this.error.set('');
    this.savedId.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.form.disable();
    this.service
      .create({
        ...value,
        supplierName: value.supplierName.trim(),
        notes: value.notes.trim(),
        items: value.items.map((item) => ({ ...item, itemName: item.itemName.trim() })),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          this.form.enable();
          this.saving.set(false);
          this.savedId.set(order.id);
          this.submitted = false;
          this.form.reset({ supplierName: '', orderDate: this.today(), notes: '' });
          this.items.clear();
          this.items.push(this.createItem());
        },
        error: (error) => {
          this.form.enable();
          this.saving.set(false);
          this.error.set(apiError(error));
        },
      });
  }
}
