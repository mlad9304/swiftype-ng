import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
      private authService: AuthService
    ) {}

    canActivate() {
        if(this.authService.isAuthenticated()) {
            return true;
        } else {
            this.authService.login();
            return false;
        }
    }
}