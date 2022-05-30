import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ActiveUsersComponent} from './active-users/active-users.component';
import {InactiveUsersComponent} from './inactive-users/inactive-users.component';
import {UsersService} from './services/users.service';
import {CounterService} from './services/counter.service';

@NgModule({
  declarations: [
    AppComponent,
    ActiveUsersComponent,
    InactiveUsersComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [UsersService, CounterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
