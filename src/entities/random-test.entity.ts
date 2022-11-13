import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  BaseEntity,
  BeforeInsert,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';
import { RandomTestQuizRecord } from './random-test-quiz-record.entity';
import { RandomTestTopic } from './random-test-topic.entity';

@ObjectType('RANDOM_TEST')
@Entity('RANDOM_TEST')
export class RandomTest extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @Field(() => Course)
  @JoinColumn({ name: 'courseId' })
  @ManyToOne(() => Course, (course) => course.randomTestsUnderThisCourse)
  course: Course;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  noOfQuestions: number;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @Field(() => [RandomTestTopic])
  @OneToMany(
    () => RandomTestTopic,
    (randomTestTopic) => randomTestTopic.randomTest,
  )
  topicsUnderThisRandomTest: RandomTestTopic[];

  @Field(() => [RandomTestQuizRecord])
  @OneToMany(
    () => RandomTestQuizRecord,
    (randomTestQuizRecord) => randomTestQuizRecord.randomTest,
  )
  testRecordsForThisRandomTest: RandomTestQuizRecord[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
  }
}
