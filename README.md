# Purchase order frontend

Angular dashboard and purchase order form, based on the supplied assignment reference.

## Run locally

1. Start the existing C# API at http://localhost:5259 (see the backend README for database setup).
2. From this folder run `npm install` if dependencies are missing, then `npm start`.
3. Open http://localhost:4200. The default route opens the dashboard.

The shared `API_BASE_URL` injection token in `src/app/services/purchase-order.ts` defaults to `http://localhost:5259/api`. All purchase order and dashboard requests go directly to that backend, without depending on the Angular development proxy. The backend must allow the frontend origin `http://localhost:4200` in its CORS configuration. For deployment, override `API_BASE_URL` with the deployed API URL (including `/api`). Configure SPA fallback to index.html for direct route navigation.

## Included

- Dashboard with latest five purchase orders, oldest ten order items, and a quantity donut chart grouped by item name.
- Responsive navigation and reusable dashboard components, following the reference's gradient header, sidebar, and three-column layout.
- Purchase order form with supplier, date, notes, dynamic item rows, validation, calculated totals, and API save feedback.
- Typed models, purchase order service (list/get/create), dashboard service, and shared API error messages.
- Loading, empty, failure, retry, and successful save states. Returning to the dashboard fetches current data.

The API determines newest/oldest order ranking. Item counts are line counts; chart totals are quantities. Amounts use two decimals without an assumed currency because the API has no currency field. The UI uses live data and requires the API/database for persistence; it does not substitute demonstration records when the API is unavailable.

## Checks

- `npm run build`
- `npm test -- --watch=false`

Tests cover component creation, dashboard endpoint integration and failure feedback, and form validation, save payloads, duplicate submission prevention, and retaining input after errors.

## API route mapping

The development API base URL is `http://localhost:5259`. Angular calls the paths below directly on that host:

| Service method | HTTP method | Path |
| --- | --- | --- |
| `PurchaseOrder.create(order)` | POST | `/api/purchase-orders` |
| `PurchaseOrder.list(page, pageSize)` | GET | `/api/purchase-orders?page=1&pageSize=20` (defaults) |
| `PurchaseOrder.get(id)` | GET | `/api/purchase-orders/{id}` |
| `DashboardService.latestOrders()` | GET | `/api/dashboard/latest-purchase-orders` |
| `DashboardService.oldestItems()` | GET | `/api/dashboard/oldest-purchase-order-items` |
| `DashboardService.itemQuantities()` | GET | `/api/dashboard/item-quantities` |

`HttpClient` serializes the create payload as JSON and sets its content type automatically. GET requests have no body. No authentication, PUT, or DELETE endpoints are assumed. The Development OpenAPI document at `http://localhost:5259/openapi/v1.json` is documentation and is not called by dashboard widgets.

Before integration testing, run `Update-Database` in Visual Studio's Package Manager Console for the backend project, then start the API with its HTTP launch profile. The Notebook/Pen sample (3 x 250 + 10 x 50) should return HTTP 201 with `netAmount: 1250` and `numberOfItems: 2`.
