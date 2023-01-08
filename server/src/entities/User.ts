import { IsEmail } from 'class-validator';
import { Length } from 'class-validator/types/decorator/decorators';
import { ValidationTypes } from 'class-validator/types/validation/ValidationTypes';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import bcript from 'bcryptjs';

@Entity('users')
export class User {
  @Index()
  @IsEmail(undefined, { message: '이메일 주소가 잘못되었습니다' })
  @Length(1, 255, { message: '이메일은 비워두거나 255자를 넘길 수 없습니다' })
  @Column({ unique: true })
  email!: string;

  @Index()
  @Length(3, 32, { message: '사용자 이름은 3자 이상이어야 합니다.' })
  @Column()
  username?: string;

  @Column()
  @Length(6, 255, { message: '비밀번호는 6자리 이상이어야 합니다' })
  password!: string;

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes?: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcript.hash(this.password, 6);
  }
}
