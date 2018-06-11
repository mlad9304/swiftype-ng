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
  MatListModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent, ProfileDialog } from './components/header/header.component';
import { FacetsComponent } from './components/facets/facets.component';
import { ResultsComponent } from './components/results/results.component';
import { CallbackComponent } from './components/callback/callback.component';

import { SharedService } from './services/shared.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: CallbackComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FacetsComponent,
    ResultsComponent,
    CallbackComponent,
    ProfileDialog
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
    MatListModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
