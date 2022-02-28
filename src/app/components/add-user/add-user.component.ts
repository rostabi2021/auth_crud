import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  errorMsg;
  user: User;
  addNewUserForm: FormGroup;
  countries: Country[] = [];
  users: User[] = [];

  constructor(private usersService: UsersService, private router: Router, private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.reactiveForm();
    this.getCountries();
    this.getUsers();
  }

  reactiveForm(){
    this.addNewUserForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      OIB: ['', [Validators.required, this.oibMaxValidator, this.oibMinValidator]],
      country: ['', [Validators.required]]
    }, {
      validators: [this.usernameAlreadyExists('username'), this.oibAlreadyExists('OIB')]
    });
  }

    
  usernameAlreadyExists(controlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];

      for (let index = 0; index < this.users.length; index++) {
        const element = this.users[index];

        if(element.username.toLowerCase() == control.value.toLowerCase()){
            control.setErrors({ usernameAlreadyExists: true });
        } 
        
      }
  }
  }

  oibAlreadyExists(controlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];

      for (let index = 0; index < this.users.length; index++) {
        const element = this.users[index];

        if(element.OIB == control.value){
            control.setErrors({ oibAlreadyExists: true });
        } 
        
      }
  }
  }

  oibMaxValidator(control: AbstractControl): { [key: string]: boolean } | null {

    if (control.value !== undefined && (isNaN(control.value) || control.value > 100000000000)) {
        return { 'oibMaxValidator': true };
    }
    return null;
  }

  oibMinValidator(control: AbstractControl): { [key: string]: boolean } | null {

    if (control.value !== undefined && (isNaN(control.value) || control.value < 10000000000 && control.value > 0)) {
        return { 'oibMinValidator': true };
    }
    return null;
  }

  getCountries(){
    this.usersService.getCountries().subscribe(data => {
      this.countries = data;
      console.log(this.countries);
    })
  }

  getUsers(){
    this.usersService.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
    })
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.usersService.sendMessage('New User Added');
  }

  getlength(number) {
    return number.toString().length;
}

  onAddUser(){
    var x = this.addNewUserForm.value.OIB.toString();
    this.addNewUserForm.value.OIB = x;
    console.log(this.addNewUserForm.value);

      this.usersService.addUser(this.addNewUserForm.value).subscribe((user) => {
        console.log(user);
        this.sendMessage();
        this.snackBar.open('New user successfully created!', 'close', {duration: 5000, panelClass: ['green-snackbar']});
      })
    }
  
  

}
