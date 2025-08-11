// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    development: {
      projectId: 'perlerwyveth',
      appId: '1:707528245165:web:33dd8eb0d6d2a50207eb24',
      databaseURL: 'https://perlerwyveth-default-rtdb.europe-west1.firebasedatabase.app',
      storageBucket: 'perlerwyveth.appspot.com',
      locationId: 'europe-west',
      apiKey: 'AIzaSyCtUz6VvXBUAhQjwM_ehArQQOSpgUaThnc',
      authDomain: 'perlerwyveth.firebaseapp.com',
      messagingSenderId: '707528245165',
      measurementId: 'G-NXZRD0EQ7C',
    },
    production: {
      projectId: 'perlerwyveth',
      appId: '*****************************',
      databaseURL: '*****************************',
      storageBucket: '*****************************',
      locationId: '*****************************',
      apiKey: '*****************************',
      authDomain: '*****************************',
      messagingSenderId: '*****************************',
      measurementId: '*****************************',
    },
  },
  env: 'development',
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
