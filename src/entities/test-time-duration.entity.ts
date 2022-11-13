import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TestType } from '@utils/types/utils.types';

@ObjectType('TEST_TIME_DURATION')
@Entity('TEST_TIME_DURATION')
export class TestTimeDuration extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => TestType)
  @Column({ type: 'enum', enum: TestType })
  testType: TestType;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  noOfQuestions: number;

  @Field(() => Int)
  @Column({ type: 'int', nullable: true })
  durationInMinutes?: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
  }
}
