import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService
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
       .then(value => console.log(`Value: ${value}`))
       .catch(reason => console.log(`Error: ${reason}`))
  }

}
