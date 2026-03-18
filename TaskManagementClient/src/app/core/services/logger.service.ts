import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly isDev = isDevMode();

  log(message: string, data?: unknown): void {
    if (this.isDev) {
      console.log(`[LOG] ${message}`, data ?? '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, data ?? '');
    }
  }

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error ?? '');
    // In production: send to Sentry / DataDog / etc.
    // Example: this.sentryService.captureException(error);
  }

  logHttpError(error: HttpErrorResponse): void {
    this.error(
      `HTTP ${error.status} — ${error.url}`,
      { status: error.status, message: error.message, body: error.error }
    );
  }
}
