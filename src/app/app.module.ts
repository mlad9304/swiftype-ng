import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatInputModule, 
  MatTabsModule, 
  MatCheckboxModule, 
  MatButtonModule,
  MatMenuModule,
  MatDialogModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
} from '@angular/material';
import {FlexLayoutModule, MediaService} from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { WebComponent } from './components/pages/web/web.component';
import { MapComponent } from './components/pages/map/map.component';
import { SecureComponent } from './components/pages/secure/secure.component';
import { SavedsearchComponent } from './components/pages/savedsearch/savedsearch.component';
import { SavedresultComponent } from './components/pages/savedresult/savedresult.component';
import { HeaderComponent, ProfileDialog } from './components/header/header.component';
import { FacetsComponent } from './components/facets/facets.component';
import { ResultsComponent } from './components/results/results.component';
import { CallbackComponent } from './components/callback/callback.component';

import { SharedService } from './services/shared.service';
import { GooglemapComponent } from './components/googlemap/googlemap.component';
import { GooglemapService } from './services/googlemap.service';
import { SearchinputComponent } from './components/searchinput/searchinput.component';
import { AutosuggestService } from './services/autosuggest.service';


const appRoutes: Routes = [
  { path: '', redirectTo: 'web', pathMatch: 'full' },
  { path: 'callback', component: CallbackComponent },
  { path: 'web', component: WebComponent },
  { path: 'map', component: MapComponent },
  { path: 'secure', component: SecureComponent },
  { path: 'savedsearch', component: SavedsearchComponent },
  { path: 'savedresult', component: SavedresultComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FacetsComponent,
    ResultsComponent,
    CallbackComponent,
    ProfileDialog,
    GooglemapComponent,
    SearchinputComponent,
    WebComponent,
    MapComponent,
    SecureComponent,
    SavedsearchComponent,
    SavedresultComponent
  ],
  entryComponents: [
    ProfileDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatInputModule,
    MatTabsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    FlexLayoutModule
  ],
  providers: [SharedService, MediaService, GooglemapService, AutosuggestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
