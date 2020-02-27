import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Auth } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: Auth){}

    canActivate(): boolean {
        return this.auth.autenticado()
    }
}