import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  loggedIn: boolean = false;
  username: string = '';
  subscription: Subscription;

  constructor( private usersService: UsersService,  private router: Router, private snackBar: MatSnackBar) {
    this.subscription = this.usersService.getMessage().subscribe(message => {
      if (message) {
        this.loggedIn = true;
        this.username = sessionStorage.getItem('logged-in')
        console.log('Ulogiran je: ' + sessionStorage.getItem('logged-in'))
      } else {
        console.log('Nitko nije ulogiran');
        this.loggedIn = false;
        this.username = '';
      }
    });
   }

  ngOnInit(): void {
    //console.log(sessionStorage.getItem('logged-in'));
    this.loggedInCheck();
  }

  loggedInCheck(){
    if (sessionStorage.getItem('logged-in')) {
      this.loggedIn = true;
      this.username = sessionStorage.getItem('logged-in')
      console.log('Ulogiran je: ' + sessionStorage.getItem('logged-in'))
    } else  {
      console.log('Nitko nije ulogiran');
      this.loggedIn = false;
      this.username = '';
    }
  }

  
  clearMessage(): void {
    // send message to subscribers via observable subject
    this.usersService.clearMessages();
  }

  logout(){
    sessionStorage.removeItem('logged-in');
    this.clearMessage();
    this.snackBar.open('You have successfully logged out!', 'close', {duration: 5000, panelClass: ['green-snackbar']});
    this.router.navigate(['/login'])
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}


