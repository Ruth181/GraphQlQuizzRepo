import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';
import { Question } from './question.entity';
import { Topic } from './topic.entity';

@ObjectType('QUESTION_COURSE_TOPIC')
@Entity('QUESTION_COURSE_TOPIC')
export class QuestionCourseTopic extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  questionId: string;

  @Field(() => Question)
  @JoinColumn({ name: 'questionId' })
  @ManyToOne(
    () => Question,
    (question) => question.questionTopicRecordsForThisQuestion,
  )
  question: Question;

  @Column({ type: 'uuid' })
  topicId: string;

  @Field(() => Topic)
  @JoinColumn({ name: 'topicId' })
  @ManyToOne(() => Topic, (topic) => topic.questionTopicRecordsForThisTopic)
  topic: Topic;

  @Column({ type: 'uuid' })
  courseId: string;

  @JoinColumn({ name: 'courseId' })
  @ManyToOne(() => Course, (course) => course.questionTopicRecordsForThisCourse)
  course: Course;

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
