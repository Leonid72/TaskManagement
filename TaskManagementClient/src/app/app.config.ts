import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideTransloco } from '@jsverse/transloco';
import { withInMemoryScrolling } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './core/transloco-loader';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { TaskMockDb } from './core/mock/task-mock.db';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideTransloco({
      config: {
        availableLangs: ['he'],
        defaultLang: 'he',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    ...(environment.useMock
      ? [importProvidersFrom(
          InMemoryWebApiModule.forRoot(TaskMockDb, {
            delay: 300,
            passThruUnknownUrl: true,
          })
        )]
      : []),
  ],
};
