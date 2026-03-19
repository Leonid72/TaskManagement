import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { environment } from '../../../environments/environment';

// Retry only on network errors and server errors (like Polly in .NET)
// Do NOT retry on client errors (4xx) — the data is wrong, retrying won't help
const RETRYABLE_STATUS_CODES = [
  0,   // Network error (no connection / CORS / server down)
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
];

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const { count, delayMs } = environment.retry;

  return next(req).pipe(
    retry({
      count,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Do not retry on 4xx — bad request, unauthorized, not found, etc.
        if (!RETRYABLE_STATUS_CODES.includes(error.status)) {
          return throwError(() => error);
        }

        // Exponential backoff: 1s → 2s → 4s  (like Polly ExponentialBackoff)
        const delayTime = delayMs * Math.pow(2, retryCount - 1);
        logger.warn(
          `[Retry] Attempt ${retryCount}/${count} → ${req.method} ${req.url}`,
          { status: error.status, delayMs: delayTime }
        );

        return timer(delayTime);
      },
    })
  );
};
