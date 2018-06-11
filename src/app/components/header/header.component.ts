import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  headerNavs: any[];
  activeLinkIndex = 0;

  isLogged = false;
  nickname = "";
  email = "";

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {

    this.headerNavs = [
      {
        label: 'Web',
        index: 0
      },
      {
        label: 'Images',
        index: 1
      }
    ];

  }

  @HostListener('input', ['$event'])
  input(e) {
    this.sharedService.setQuery(e.target.value);
  }

  ngOnInit() {
    this.authService.getProfile((err, profile) => {
      if(profile) {
        this.isLogged = true;
        this.nickname = profile.nickname;
        this.email = profile.name;
      }
    })
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
    this.sharedService.gotoEmitter(this.activeLinkIndex);
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