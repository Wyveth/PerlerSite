import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, importProvidersFrom, inject } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { AppConfig } from './app/shared/models/app.config';
import { AppResource } from './app/shared/models/app.resource';
import { routes } from './app/app.route';
import { environment } from './environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(ToastModule),
    MessageService, // <-- instance unique globale
    provideRouter(routes
    ),
    provideFirebaseApp(() =>
        initializeApp(
            environment.firebase[environment.env as keyof typeof environment.firebase] as FirebaseOptions,
        ),
    ),
    providePrimeNG({
      theme: {
          preset: Aura,
          options: {
              cssLayer: {
                  name: 'primeng',
                  order: 'theme, base, primeng'
              }
          }
      }
    }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnimations(),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura }
    }),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const config = inject(AppConfig);
        return config.load();
      }
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const resource = inject(AppResource);
        return resource.load();
      }
    }
  ],
});
