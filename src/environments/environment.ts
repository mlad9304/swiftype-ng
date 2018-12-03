// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  AUTH0_CLIENT_ID: 'QtJKA5Os_QRRE4OLaEJ_membY4vElfeo',
  AUTH0_DOMAIN: 'marcoauth0.auth0.com',
  AUTH0_CALLBACK_URL: 'http://localhost:4200/callback',
  SEARCH_SERVER_URL: 'https://3ovpd2kl2m.execute-api.us-east-2.amazonaws.com/dev/search',
  SEARCH_SECURE: 'http://c47f31d4.ngrok.io/det/_search',
  FACETS_SIZE: 10,
  SERVER_URL_FOR_SAVING: 'https://19d7d779f8a502497d7eed2a5d035771.ap-southeast-2.aws.found.io:9243',
  SEARCH_MY_SAVES: 'https://3ovpd2kl2m.execute-api.us-east-2.amazonaws.com/dev/mysaves',
  SEARCH_MY_SEARCHES: 'https://3ovpd2kl2m.execute-api.us-east-2.amazonaws.com/dev/mysearches',
  SAVE_MY_SEARCHES: 'https://3ovpd2kl2m.execute-api.us-east-2.amazonaws.com/dev/mysearches/save',
  layout: 'google', // google or card
  BING_AUTOSUGGEST_API_URL: 'https://api.cognitive.microsoft.com/bing/v7.0/suggestions',
  BING_AUTOSUGGEST_API_KEY: 'c4bad504fe504930a095097d23a34502'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
