import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  id: number;
  user: User;
  userDetailsForm: FormGroup;
  countries: Country[];

  constructor(private http: HttpClient, private usersService: UsersService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loggedInCheck();
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.reactiveForm();
    this.getUser();

  }

  loggedInCheck(){
    if (sessionStorage.getItem('logged-in')) {

    } else  {
      this.router.navigate(['/login'])
    }
  }

  reactiveForm(){
    this.userDetailsForm = this.formBuilder.group({
      username: [],
      firstName: [],
      lastName: [],
      password: [],
      OIB: [],
      country: []
      /*objectID: [{ value: null}, [Validators.required]],
      scopeContext:  [{ value: null}, [Validators.required]],*/
    });
  }

  getUser(){
    this.usersService.getUser(this.id).subscribe(data => {
      this.user = data;
      console.log(this.user);
      this.getCountries();

      /*this.userDetailsForm.setValue({
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        password: this.user.password,
        OIB: this.user.OIB,
        country: this.user.country
      })*/
    })
  }

  getCountries(){
    this.usersService.getCountries().subscribe(data => {
      this.countries = data;
      console.log(this.countries);
      this.getCountryName();
      this.userDetailsForm.setValue({
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        password: this.user.password,
        OIB: this.user.OIB,
        country: this.user.country
      })
    })
  }

  getCountryName(){
    for (let index = 0; index < this.countries.length; index++) {
      const element = this.countries[index];

      if (this.user.country == element.id) {
        console.log(element.countryName);
        this.user.country = element.countryName;
      }       
    }
  }

  /*getRole(id: any) {
    this.api.getRole(id).subscribe((data: any) => {
      this.role = data;
      console.log(this.role);
      this.roleUsers = data.users;
      console.log(this.roleUsers);
      this.objectID = data.objectID;
      this.roleForm.setValue({
        objectID: data.objectID,
        scopeContext: data.scopeContext,
        orgID: data.orgID,
        visibility: data.visibility,
        name: data.name,
        scopeOID: data.scopeOID,
        description: data.description != null ? data.description : null ,
        users: data.users
      });
      this.name = this.roleForm.value.name;
      this.dataSourceUsers           = new MatTableDataSource(data.users);
      this.dataSourceUsers.paginator = this.paginator.toArray()[0];
      this.dataSourceUsers.sortingDataAccessor = (item, property) => {
        if (property.includes('.')) return property.split('.').reduce((o,i)=>o[i], item)
        return item[property];
     };

     this.dataSourceUsers.sort = this.sort1;
     console.log(this.dataSourceUsers);
    }, error => {
      this.errorMsg = error
      this.costCenterService.showErrorNotification(this.errorMsg, this.translate.instant('COST.SNACKBAR_CLOSE'), 'error');
    });
  }*/
}
