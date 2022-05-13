import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {PostService} from "../../services/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IComment, IPost, IUser} from "../../model/post";
import * as _ from 'lodash';

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
      .then(value => {
        this.posts = value.reverse();

        const postUserIds = this.posts.map(item => item.userId);
        // console.log(postUserIds)

        const commentUserIds = this.posts.flatMap(item => item.comments).map(item => item.userId)
        // console.log(commentUserIds)

        const uniqueUserIds = _.uniq(_.concat(postUserIds, commentUserIds));
        // console.log(uniqueUserIds)

        uniqueUserIds.forEach(id => {
          if (this.usernames[id] == undefined) {
            this.userService.getUserById(id)
              .subscribe({
                next: user => {
                  // console.log(`Setando this.username[${id}] = ${user.username}`)
                  this.usernames[id] = user.username;
                },
                error: err => console.log(err)
              });
          }
        });
      });
  }

  comment(postId: number, postIndex: number): void {
    const currentUserId = this.userService.user?.id;
    if (currentUserId == undefined) return;
    // const userId: number = currentUserId;

    this.posts
      .filter(post => post.id === postId)
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
    const currentUserId = this.userService.user?.id;
    if (currentUserId == undefined) return;

    const newPost: IPost = new IPost();
    newPost.userId = currentUserId;
    newPost.text = this.newPost;

    this.postService.createNewPost(newPost)
      .then(value => {
        this.snackBar.open('Post created, please refresh the page', '', {duration: 1500});
      })
      .catch(reason => console.log(reason));

  }

  toggleLike(postId: number): void {
    const userId = this.userService.user?.id;
    if (userId == undefined) return;

    const post = this.posts.find(item => item.id === postId);
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
    const userId = this.userService.user?.id;
    if (userId == undefined) return false;

    const post = this.posts.find(item => item.id === postId);
    if (post == undefined) return false;

    const likesFromThisUser = post.likes.find(like => like.userId === userId);
    if (likesFromThisUser == undefined) return false;

    return true;
  }
}
