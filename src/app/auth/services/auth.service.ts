import { Subject } from 'rxjs';

import { AuthData } from '../models/auth-data';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { UIService } from 'src/app/shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private angularFireAuth: Auth,
    private uiService: UIService
  ) {}

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    createUserWithEmailAndPassword(
      this.angularFireAuth,
      authData.email,
      authData.password
    )
      .then((result) => {
        console.log(result);
        this.authSuccess();
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        console.log(error.message);
        this.uiService.showSnackbar('Signup failed', 3000, undefined);
        this.uiService.loadingStateChanged.next(false);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    signInWithEmailAndPassword(
      this.angularFireAuth,
      authData.email,
      authData.password
    )
      .then((result) => {
        console.log(result);
        this.authSuccess();
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        console.log(error.message);
        this.uiService.showSnackbar('Login failed', 3000, undefined);
      });
  }

  logout() {
    signOut(this.angularFireAuth);
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  authSuccess() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
