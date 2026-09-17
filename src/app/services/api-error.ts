import { HttpErrorResponse } from '@angular/common/http';

export function apiError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0 || error.status >= 500) return 'We could not connect to the purchase order service. Check that the API is running and try again.';
    if (error.error?.errors) return Object.values(error.error.errors).flat().join(' ');
    if (error.status === 404) return 'This purchase order could not be found.';
  }
  return 'The request could not be completed. Please try again.';
}
