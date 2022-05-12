import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]]
  });

  login() {
    this.userService.getUser(this.loginForm.value.email)
      .then((value: any) => {
        if (value.length == 0) {
          console.log("account does not exist");
          this.snackBar.open('Account does not exist', 'ok');
        } else {
          if (value[0].password === this.loginForm.value['password']) {
            console.log("password match");
            this.snackBar.open('Login successful', '', { duration: 1000});
            this.userService.user = value[0];
            localStorage.setItem('user', JSON.stringify(value[0]));
            this.router.navigate(['/posts']);
          } else {
            console.log("wrong password")
            this.snackBar.open('Incorrect password', 'ok');
          }
        }
      })
      .catch(reason => console.log(`Error: ${reason}`));
  }

}
