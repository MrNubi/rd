import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Comment from '../entities/Comment';
import BaseEntity from '../entities/Entity';
import Post from '../entities/Post';
import { User } from '../entities/User';

@Entity('votes')
export default class Vote extends BaseEntity {
  @Column({ type: Number })
  value?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user?: User;

  @Column({ type: String })
  username: string;

  @Column({ nullable: true, type: Number })
  postId?: number;

  @ManyToOne(() => Post)
  post?: Post;

  @Column({ nullable: true, type: Number })
  commentId?: number;

  @ManyToOne(() => Comment)
  comment?: Comment;
}
