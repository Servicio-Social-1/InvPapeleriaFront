import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialogMessageComponent } from './shared/components/dialog-message/dialog-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './shared/interceptors/token-interceptor.service';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es';
 
registerLocaleData(localeEsMx, 'es');

@NgModule({
    declarations: [
        AppComponent,
        ErrorPageComponent,
        DialogMessageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: LOCALE_ID, useValue: 'es'}],
    bootstrap: [AppComponent]
})
export class AppModule { }
