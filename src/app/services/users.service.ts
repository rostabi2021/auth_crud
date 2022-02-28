import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { stringify } from 'querystring';
import { Observable, Subject } from 'rxjs';
import { ErrorNotificationComponent } from '../components/error-notification/error-notification.component';
import { Country } from '../models/Country';
import { User } from '../models/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
    //'USER':  sessionStorage.getItem('logged-in')
  })
}



@Injectable({
  providedIn: 'root'
})

export class UsersService {

  deleteUserValue: User;
  editUserValue: User;
  username: string;
  

  private subject = new Subject<any>();

  private apiUrlUsers = 'http://localhost:5000/users'

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.username = sessionStorage.getItem('logged-in')
   }

   getContacts(){
     let httpHeaders = new HttpHeaders({

     })

     httpHeaders.append('USER', this.username);
     return httpHeaders;
   }

  getCountries(){
    return this.http.get<Country[]>('/assets/countries.json');
  }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrlUsers);
  }

  getUser(id: number): Observable<User>{
    const url = `${this.apiUrlUsers}/${id}`;
    return this.http.get<User>(url);
  }

  addUser(user: User): Observable<User>{
    return this.http.post<User>(this.apiUrlUsers, user, httpOptions)
  }

  deleteUser(user: User):Observable<User>{
    const url = `${this.apiUrlUsers}/${user.id}`;
    return this.http.delete<User>(url);
  }

  deleteUserValue2(user: User){
    this.deleteUserValue = user;
  }
  
  get getDeleteUserValue(){
    return this.deleteUserValue;
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrlUsers}/${user.id}`;
    return this.http.put<User>(url, user, httpOptions);
  }

  editUserValue2(user: User){
    this.editUserValue = user;
  }
  
  get getEditUserValue(){
    return this.editUserValue;
  }

  sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  clearMessages() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }

  showErrorNotification(displayMessage: string, buttonText: string, messageType: 'error' | 'success'){
    this.snackBar.openFromComponent(ErrorNotificationComponent, {
      data: {
        message: displayMessage,
        buttonText: buttonText,
        type: messageType
      },
      //duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: messageType
    })
  }
}
