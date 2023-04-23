import { NgModule, inject } from "@angular/core";
import { CanLoadFn, RouterModule, Routes } from "@angular/router";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AuthGuard } from "./auth/guard/auth.guard";


const canLoadTraining: CanLoadFn =
    () => {
      return inject(AuthGuard).canActivate();
    };

const routes: Routes = [
    { path: '', component: WelcomeComponent},
    { path: 'training', loadChildren: () => import('./training/training.module').then(m => m.TrainingModule), canLoad: [canLoadTraining]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}