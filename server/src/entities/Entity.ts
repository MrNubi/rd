import { instanceToPlain } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default abstract class Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  toJSON() {
    return instanceToPlain(this);
    //클래스 객체를 플레인 객체(리터럴 객체)로 변환
    //axios는 data라는 바디 안에 string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    //넣어줄 수 있음 -> class객체 인식불가
    //그래서 이걸 plain객체로 바꿔주는..듯?
  }
}
