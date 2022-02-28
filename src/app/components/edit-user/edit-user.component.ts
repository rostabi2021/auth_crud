import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: User;
  editUserForm: FormGroup;
  countries: Country[];
  users: User[] = [];

  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = {};
    this.user = this.usersService.getEditUserValue;
    console.log(this.user);
    this.reactiveForm();
    this.getCountries();
    this.getUsers();
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.usersService.sendMessage('User Edited');
  }

  reactiveForm(){
    this.editUserForm = this.formBuilder.group({
      id: [''],
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
      this.getCountryName();
      this.editUserForm.setValue({
        id: this.user.id,
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        password: this.user.password,
        OIB: this.user.OIB,
        country: this.user.country
      })
    })
  }


  getUsers(){
    this.usersService.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
      this.users = data.filter((user)=> user.id !== this.user.id);
      console.log(this.users);
    })
  }

  getCountryName(){
    const toSelect = this.countries.find(c => c.id == this.user.country);
    this.editUserForm.get('country').setValue(toSelect);
  }

  updateUser(){
    console.log(this.editUserForm.value);
    this.usersService.updateUser(this.editUserForm.value).subscribe(data => {
      console.log(data);
      this.sendMessage();
      this.router.navigate(['/user', data.id]);
      this.snackBar.open('User successfully updated!', 'close', {duration: 5000, panelClass: ['green-snackbar']});
    });
  }

}
