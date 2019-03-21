import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

import { TokenInterceptor } from './token-interceptor';


import { AppComponent } from './app.component';
import { LandingComponent } from './landing-page/landing/landing.component';
import { LoginComponent } from './landing-page/login/login.component';
import { SignUpComponent } from './landing-page/sign-up/sign-up.component';
import { MainComponent } from './home-page/main/main.component';

import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './home-page/profile/profile.component';
import { RanktableComponent } from './home-page/ranktable/ranktable.component';
import { GameComponent } from './home-page/game/game.component';
import { PlayComponent } from './home-page/play/play.component';
import { PageNotFoundComponent } from './landing-page/util/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    SignUpComponent,
    MainComponent,
    ProfileComponent,
    RanktableComponent,
    GameComponent,
    PlayComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
