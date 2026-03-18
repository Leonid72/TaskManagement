import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@jsverse/transloco';
import { LoggerService } from '../services/logger.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const t = inject(TranslocoService);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      logger.logHttpError(error);

      const title = t.translate('errors.title');
      let message: string;

      switch (error.status) {
        case 0:
          message = t.translate('errors.network');
          break;
        case 400:
          message = t.translate('errors.badRequest');
          break;
        case 404:
          message = t.translate('errors.notFound');
          break;
        case 500:
          message = t.translate('errors.server');
          break;
        default:
          message = t.translate('errors.unknown');
      }

      toastr.error(message, title);
      return throwError(() => error);
    })
  );
};
