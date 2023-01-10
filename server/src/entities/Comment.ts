import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { makeId } from '../utils/helper';
import BaseEntity from './Entity';
import Post from '../entities/Post';
import { User } from '../entities/User';
import Vote from '../entities/Vote';

@Entity('comments')
export default class Comment extends BaseEntity {
  @Index()
  @Column({ type: String })
  identifier: string;

  @Column({ type: String })
  body: string;

  @Column({ type: String })
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column({ type: Number })
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Expose() get voteScore(): number {
    const initialValue = 0;
    return this.votes?.reduce(
      (previousValue, currentObject) =>
        previousValue + (currentObject.value || 0),
      initialValue
    );
  }

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(8);
  }
}
