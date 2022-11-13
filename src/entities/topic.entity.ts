import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';
import { QuestionCourseTopic } from './question-course-topic.entity';
import { RandomTestTopic } from './random-test-topic.entity';

@ObjectType('TOPIC')
@Entity('TOPIC')
export class Topic extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'uuid' })
  courseId: string;

  @Field(() => Course)
  @JoinColumn({ name: 'courseId' })
  @ManyToOne(() => Course, (course) => course.topicsUnderThisCourse)
  course: Course;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @Field(() => [QuestionCourseTopic])
  @OneToMany(
    () => QuestionCourseTopic,
    (questionCourseTopic) => questionCourseTopic.topic,
  )
  questionTopicRecordsForThisTopic: QuestionCourseTopic[];

  @Field(() => [RandomTestTopic])
  @OneToMany(() => RandomTestTopic, (randomTestTopic) => randomTestTopic.topic)
  randomTestTopicsForThisTopic: RandomTestTopic[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
    this.name = this.name.toUpperCase();
  }
}
