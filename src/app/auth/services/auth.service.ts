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
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';
import * as AuthActions from '../../auth/auth.actions';
import { TrainingService } from 'src/app/training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();

  constructor(
    private router: Router,
    private angularFireAuth: Auth,
    private uiService: UIService,
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {}

  registerUser(authData: AuthData) {
    //this.uiService.loadingStateChanged.next(true);
    this.store?.dispatch(new UI.StartLoading());
    createUserWithEmailAndPassword(
      this.angularFireAuth,
      authData.email,
      authData.password
    )
      .then(() => {
        this.authSuccess();
        //this.uiService.loadingStateChanged.next(false);
        this.store?.dispatch(new UI.StopLoading());
      })
      .catch(() => {
        this.uiService.showSnackbar('Signup failed', 3000, undefined);
        //this.uiService.loadingStateChanged.next(false);
        this.store?.dispatch(new AuthActions.SetUnauthenticated());
        this.store?.dispatch(new UI.StopLoading());
        this.trainingService.cancelSubscriptions();
      });
  }

  login(authData: AuthData) {
    //this.uiService.loadingStateChanged.next(true);
    this.store?.dispatch(new UI.StartLoading());
    signInWithEmailAndPassword(
      this.angularFireAuth,
      authData.email,
      authData.password
    )
      .then((result) => {
        console.log(result);
        this.authSuccess();
        //this.uiService.loadingStateChanged.next(false);
        this.store?.dispatch(new UI.StopLoading());
      })
      .catch(() => {
        //this.uiService.loadingStateChanged.next(false);
        this.store?.dispatch(new AuthActions.SetUnauthenticated());
        this.store?.dispatch(new UI.StopLoading());
        this.trainingService.cancelSubscriptions();
        this.uiService.showSnackbar('Login failed', 3000, undefined);
      });
  }

  logout() {
    signOut(this.angularFireAuth);
    this.store.dispatch(new AuthActions.SetUnauthenticated());
    this.router.navigate(['/login']);
  }

  authSuccess() {
    this.store?.dispatch(new AuthActions.SetAuthenticated());
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
