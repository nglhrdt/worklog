import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { registerLocaleData } from '@angular/common';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { REGION, ORIGIN } from '@angular/fire/compat/functions';

import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe, 'de-DE');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();

      if (!environment.production) {
        connectAuthEmulator(auth, `http://localhost:9099`)
      }

      return (auth);
    }),
    provideFirestore(() => {
      const firestore = getFirestore()

      if (!environment.production) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }

      return (firestore);
    }),
    provideFunctions(() => {
      const functions = getFunctions();

      if (!environment.production) {
        connectFunctionsEmulator(functions, 'localhost', 5001)
      }

      return functions;
    })
  ],
  providers: [
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: REGION, useValue: 'europe-west1' },
    { provide: ORIGIN, useValue: 'https://worklog-cf985.web.app' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
