export interface ILike {
  userId: number;
}

export interface IComment {
  userId: number;
  comment: string;
}

export class IPost {
  public postId: number = 0;
  public userId: number = 0;
  public text: string = '';
  public imageURL: string = '';
  public likes: Array<ILike> = [];
  public comments: Array<IComment> = [];
}

export interface IUser {
  userId: number;
  username: string;
  email: string;
  password: string;
}

export interface IUserWithoutPass {
  userId: number;
  username: string;
  email: string;
}
