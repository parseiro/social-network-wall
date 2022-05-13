import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IPost} from "../model/post";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getPosts(): Promise<Array<IPost>> {
    return new Promise((resolve, reject) => {
      this.http.get(`http://localhost:3000/posts`).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    });
  }

  updatePost(post: IPost) {
    return new Promise((resolve, reject) => {
      this.http.put(`http://localhost:3000/posts/${post.id}`, post).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    });
  }

  public createNewPost(dataObj: IPost) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/posts', dataObj).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    });
  }
}
