import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';
import { User } from './user.entity';

@ObjectType('DEPARTMENT')
@Entity('DEPARTMENT')
export class Department extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @Field(() => [Course])
  @OneToMany(() => Course, (course) => course.department)
  coursesUnderThisDepartment: Course[];

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.department)
  usersUnderThisDepartment: User[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
    this.name = this.name.toUpperCase();
  }
}
