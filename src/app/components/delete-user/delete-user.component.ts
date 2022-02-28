import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  user: User;

  constructor( private usersService: UsersService,  private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = {};
    this.user = this.usersService.getDeleteUserValue;
    console.log(this.user);
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.usersService.sendMessage('User deleted');
  }

  onDeleteUser(){
    this.usersService.deleteUser(this.user).subscribe((user) => {
      console.log(user);
      this.sendMessage();
      this.snackBar.open('User successfully deleted!', 'close', {duration: 5000, panelClass: ['green-snackbar']});
    })
  }

}
