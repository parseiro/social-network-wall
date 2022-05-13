import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IUser, IUserWithoutPass} from "../model/post";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: IUser | undefined;

  users: Array<IUserWithoutPass> = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  public createNewUser(dataObj: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/users', dataObj).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    });
  }

  public getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`http://localhost:3000/users?email=${email}`).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    });
  }

  public isLogged(): boolean {
    if (this.user == undefined || this.user == null) {
      const str: string | null = localStorage.getItem('user');
      if (str == null) {
        return false;
      }
      this.user = JSON.parse(str);
    }

    return true;
  }

  public logout() {
    this.user = undefined;
    localStorage.removeItem('user');
    this.snackBar.open('You have been logged out', '', {duration: 1000})
    this.router.navigate(['/login']);
  }

  public login(user: any) {
    this.snackBar.open('Login successful', '', {duration: 1000});
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUsernameById(userId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(`http://localhost:3000/users?userId=${userId}`).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    });
  }
}
