import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes }  from '@angular/router';
import { LandingComponent } from './landing-page/landing/landing.component';
import { LoginComponent } from './landing-page/login/login.component';
import { SignUpComponent } from './landing-page/sign-up/sign-up.component';
import { MainComponent } from './home-page/main/main.component';
import { RanktableComponent } from './home-page/ranktable/ranktable.component';
import { ProfileComponent } from './home-page/profile/profile.component';
import { GameComponent } from './home-page/game/game.component';
import { AuthGuard } from './auth.guard';
import { PlayComponent } from './home-page/play/play.component';
import { PageNotFoundComponent } from './landing-page/util/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'games', component: GameComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'ranktable', component: RanktableComponent },
      { path: 'play', component: PlayComponent}
    ]
  },
  { path: '',
    component: LandingComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent }
    ]
  }
  ,
  {
    path: '**', // wildcard
    component: PageNotFoundComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only!!!!!!!!!!!
    )
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
