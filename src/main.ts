import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { Storage, StorageConfigToken, provideStorage } from '@ionic/storage-angular';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    {
      provide: StorageConfigToken,
      useValue: {} as any, // Configuración por defecto
    },
    {
      provide: Storage,
      useFactory: provideStorage,
      deps: [PLATFORM_ID, StorageConfigToken],
    },
    // Firebase Configuration
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideRemoteConfig(() => getRemoteConfig()),
    provideAnalytics(() => getAnalytics()),
  ],
});
