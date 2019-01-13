import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { ServerService } from './server.service';
import {ContentInterceptor} from './content.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ServerService, {provide: HTTP_INTERCEPTORS, useClass: ContentInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
