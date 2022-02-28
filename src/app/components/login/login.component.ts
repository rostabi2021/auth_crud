import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  users: User[] = [];

  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loggedInCheck();
    this.reactiveForm();
  }
  
  loggedInCheck(){
    if (sessionStorage.getItem('logged-in')) {
      this.router.navigate(['/'])
    } else  {

    }
  }

  reactiveForm(){
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.usersService.sendMessage('User logged in');
  }

  onLogin(){
    //console.log(this.loginForm.value);
    //sessionStorage.setItem("logged-in",this.loginForm.value.username);
    this.usersService.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
      const user = this.users.find((a: any)=>{
        return a.username === this.loginForm.value.username && a.password === this.loginForm.value.password
      })
      if (user) {
        sessionStorage.setItem("logged-in",this.loginForm.value.username);
        this.sendMessage();
        this.loginForm.reset();
        this.snackBar.open('You have successfully logged in!', 'close', {duration: 5000, panelClass: ['green-snackbar']});
        this.router.navigate(['/'])
      } else {
        this.loginForm.reset();
        this.snackBar.open('User not found!', 'close', {duration: 5000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['red-snackbar']});
      }
    }, err=> {
      alert("Something went wrong!");
    })
    
  }

}
