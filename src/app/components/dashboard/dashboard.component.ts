import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { Country } from 'src/app/models/Country';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  countries: Country[] = [];
  users: User[] = [];
  username: string = '';

  displayedColumns: string[] = ['firstName', 'lastName', 'username','action'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  subscription: Subscription;

  constructor(private http: HttpClient, private usersService: UsersService, public dialog: MatDialog, private snackBar: MatSnackBar,  private router: Router) {
    this.subscription = this.usersService.getMessage().subscribe(message => {
      if (message) {
        this.getUsers();
      } else {
      }
    });
   }

  ngOnInit(): void {
    this.loggedInCheck();
    this.getCountries();
    this.getUsers();
    this.username = sessionStorage.getItem('logged-in')
  }

  loggedInCheck(){
    if (sessionStorage.getItem('logged-in')) {

    } else  {
      this.router.navigate(['/login'])
    }
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
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  addNewUser() {
    this.dialog.open(AddUserComponent, {
      width: '60%'
    });
  }

  editUser(user: User) {
    this.dialog.open(EditUserComponent, {
      width: '60%'
    });
    this.usersService.editUserValue2(user);
  }

  deleteUser(user: User) {
    this.dialog.open(DeleteUserComponent, {
      autoFocus: false,
      width: '40%'
    });
    this.usersService.deleteUserValue2(user);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
