import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';

import { environment } from '../../environments/environment';

(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() logged: EventEmitter<any> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();

  auth0 = new auth0.WebAuth({
    clientID: environment.AUTH0_CLIENT_ID,
    domain: environment.AUTH0_DOMAIN,
    responseType: 'token id_token',
    audience: `https://${environment.AUTH0_DOMAIN}/userinfo`,
    redirectUri: environment.AUTH0_CALLBACK_URL,
    scope: 'openid profile'
  });

  constructor(
    public router: Router
  ) { }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);

        this.logged.emit({
          isLogged: true
        });

        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  logoutEmitter() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    this.logout.emit({
      logout: true
    });

    // Go back to the home route
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  getProfile(callback) {
    var accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // throw new Error('Access Token must exist to fetch profile');
      return;
    }
    this.auth0.client.userInfo(accessToken, function(err, profile) {
      callback(err, profile);
    });
  }
}
