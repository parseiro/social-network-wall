import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {PostService} from "../../services/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IComment, IPost, IUser} from "../../model/post";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(
    public userService: UserService,
    private postService: PostService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (!this.userService.isLogged()) {
      this.router.navigate(['/login']);
    }

    this.getPosts();
  }

  posts: Array<IPost> = [];
  commentText: Array<string> = [];
  newPost: string = '';
  usernames: Array<string> = [];

  public getPosts() {
    this.postService.getPosts()
      .then((value: any) => {
        this.posts = value.reverse();
        const userIds = this.posts.map(item => item.userId);
        userIds.forEach(id => {
          if (this.usernames[id] == undefined) {
            this.userService.getUsernameById(id).then(username => this.usernames[id] = username);
          }
        });

      })
      .catch(reason => console.log(reason));
  }

  comment(postId: number, postIndex: number): void {
    const currentUserId = this.userService.user?.userId;
    if (currentUserId == undefined) return;
    // const userId: number = currentUserId;

    this.posts
      .filter(post => post.postId === postId)
      .forEach((post, index) => {
        const commentObj: IComment = {
          userId: currentUserId,
          comment: this.commentText[postIndex]
        };
        this.posts[index].comments.push(commentObj);
        this.commentText[postIndex] = '';
        this.postService.updatePost(this.posts[index]);
      })
  }

  post(): void {
    if (this.userService.user == undefined) return;

    const newPost: IPost = new IPost();
    newPost.userId = this.userService.user.userId;
    newPost.text = this.newPost;

    this.postService.createNewPost(newPost)
      .then(value => {
        this.snackBar.open('Post created, please refresh the page', '', {duration: 1500});
      })
      .catch(reason => console.log(reason));

  }

  toggleLike(postId: number): void {
    const userId = this.userService.user?.userId;
    if (userId == undefined) return;

    const post = this.posts.find(item => item.postId === postId);
    if (post == undefined) return;

    const likeIndex = post.likes.findIndex(like => like.userId === userId);

    if (likeIndex == -1) {
      post.likes.push({userId: userId});

    } else {
      post.likes.splice(likeIndex, 1);
    }

    this.postService.updatePost(post);
  }

  didILikeThatPost(postId: number): boolean {
    const userId = this.userService.user?.userId;
    if (userId == undefined) return false;

    const post = this.posts.find(item => item.postId === postId);
    if (post == undefined) return false;

    const likesFromThisUser = post.likes.find(like => like.userId === userId);
    if (likesFromThisUser == undefined) return false;

    return true;
  }
}
