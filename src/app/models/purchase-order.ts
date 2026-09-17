export interface OrderItemInput { itemName: string; quantity: number; unitPrice: number; }
export interface CreateOrderRequest { supplierName: string; orderDate: string; notes: string; items: OrderItemInput[]; }
export interface OrderSummary { id: number; netAmount: number; numberOfItems: number; }
export interface OrderResponse extends OrderSummary, CreateOrderRequest { createdAtUtc: string; items: (OrderItemInput & { id: number; lineTotal: number })[]; }
export interface OldestItem { purchaseOrderId: number; itemName: string; quantity: number; }
export interface ItemQuantity { itemName: string; quantity: number; }
