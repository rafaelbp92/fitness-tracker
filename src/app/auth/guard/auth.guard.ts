import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { take } from "rxjs";

@Injectable()
export class AuthGuard {
    constructor(private store : Store<fromRoot.State>, private router: Router){}

    canActivate() {
        return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
    }

    canLoad() {
        return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
    }
}