import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ENVIRONMENT_INITIALIZER,
  importProvidersFrom,
  inject
} from '@angular/core';
import { provideFirebaseApp, initializeApp, FirebaseOptions } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.route';
import { environment } from './environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppResource } from './app/shared/models/app.resource';
import { AppConfig } from './app/shared/models/app.config';
import './app/shared/extension/string.extension';

export function loadResources(resourceService: AppResource) {
  return () => resourceService.load();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(ToastModule),
    MessageService,
    ConfirmationService,
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideFirebaseApp(() =>
      initializeApp(
        environment.firebase[
          environment.env as keyof typeof environment.firebase
        ] as FirebaseOptions
      )
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      },
      translation: {
        firstDayOfWeek: 1,
        dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: [
          'janvier',
          'février',
          'mars',
          'avril',
          'mai',
          'juin',
          'juillet',
          'août',
          'septembre',
          'octobre',
          'novembre',
          'décembre'
        ],
        monthNamesShort: [
          'jan',
          'fév',
          'mar',
          'avr',
          'mai',
          'jun',
          'jul',
          'aoû',
          'sep',
          'oct',
          'nov',
          'déc'
        ],
        today: "Aujourd'hui",
        clear: 'Effacer',
        weekHeader: 'Sem'
      }
    }),
    provideAnimations(),
    provideHttpClient(),
    provideAnimationsAsync(),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const config = inject(AppConfig);
        return config.load();
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadResources,
      deps: [AppResource],
      multi: true
    }
  ]
});
