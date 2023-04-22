import { Subject } from 'rxjs';

import { User } from '../models/user.model';
import { AuthData } from '../models/auth-data';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router, private angularFireAuth: Auth) {}

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(
      this.angularFireAuth,
      authData.email,
      authData.password
    )
      .then((result) => {
        console.log(result);
        this.authSuccess();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    signInWithEmailAndPassword(
      this.angularFireAuth,
      authData.email,
      authData.password
    )
      .then((result) => {
        console.log(result);
        this.authSuccess();
      })
      .catch((error) => {
        console.log(error);
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
