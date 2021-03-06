import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {IUser} from "../../model/post";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  createAccountForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.maxLength(10)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]]
  });

  create() {
    // console.log(this.createAccountForm.value);

     this.userService.createNewUser(this.createAccountForm.value)
       .then((value: IUser) => {
         // console.log(`Value: ${value}`);
         this.userService.user = value;
         this.router.navigate(['/posts']);
       })
       .catch(reason => {
         console.log(`Error: ${reason}`);

       })
  }

}
