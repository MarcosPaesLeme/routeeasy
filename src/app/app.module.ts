import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataService } from './data.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCv3dSKvGm_qWmmRAVncrUvby6wgFzYYf8',
      libraries: ['places']
    }),
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
