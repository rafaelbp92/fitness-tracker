import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard {
    constructor(private authService: AuthService, private router: Router){}

    canActivate() {
        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

    canLoad() {
        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}