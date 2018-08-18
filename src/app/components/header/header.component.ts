import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { query } from '@angular/animations';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  headers: string[] = ['web', 'map', 'secure', 'savedsearch', 'savedresult'];

  activeLinkIndex = 0;

  isLogged = false;
  nickname = "";
  email = "";

  query: string = "";

  loggedSubscriber;
  changedQuerySubscriber;
  setNavIndexSubscriber;


  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private location: Location
  ) {
    router.events.subscribe((val) => {
      let path = location.path().substr(1);
      this.activeLinkIndex = this.headers.indexOf(path);
    })
  }

  ngOnInit() {
    
    this.loggedSubscriber = this.authService.logged.subscribe(isLogged => {
      this.getProfile();
    });

    this.getProfile();

    this.changedQuerySubscriber = this.sharedService.changedQuery.subscribe(query => {
      if(this.activeLinkIndex === 1 || this.activeLinkIndex === 2)
        return;
      this.activeLinkIndex = 0; //Web
    });

    this.setNavIndexSubscriber = this.sharedService.setNavIndex.subscribe(index => {
      this.activeLinkIndex = index;
    })
  }

  ngOnDestroy() {
    this.loggedSubscriber.unsubscribe();
    this.changedQuerySubscriber.unsubscribe();
    this.setNavIndexSubscriber.unsubscribe();
  }

  getProfile() {
    this.authService.getProfile((err, profile) => {
      if(profile) {
        this.isLogged = true;
        this.nickname = profile.nickname;
        this.email = profile.name;
      }
    });
  }

  profile() {
    let dialogRef = this.dialog.open(ProfileDialog, {
      width: '250px',
      data: { nickname: this.nickname, email: this.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  goto(index) {
    this.activeLinkIndex = index;
    this.sharedService.gotoEmitter(index);
    switch(index) {
      case 0:
        this.router.navigate(['web']);
        break;
      case 1:
        this.router.navigate(['map']);
        break;
      case 2:
        this.router.navigate(['secure']);
        break;
      case 3:
        this.router.navigate(['savedsearch']);
        break;
      case 4:
        this.router.navigate(['savedresult']);
        break;

    }

  }

  logout() {
    this.isLogged = false;
    this.authService.logoutEmitter();
  }

}


@Component({
  selector: 'profile-dialog',
  templateUrl: 'profile-dialog.html',
})
export class ProfileDialog {

  constructor(
    public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}