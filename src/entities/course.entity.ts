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
import { Department } from './department.entity';
import { QuestionCourseTopic } from './question-course-topic.entity';
import { QuizSession } from './quiz-session.entity';
import { RandomTest } from './random-test.entity';
import { Topic } from './topic.entity';

@ObjectType('COURSE')
@Entity('COURSE')
export class Course extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'uuid' })
  departmentId: string;

  @Field(() => Department)
  @JoinColumn({ name: 'departmentId' })
  @ManyToOne(
    () => Department,
    (department) => department.coursesUnderThisDepartment,
  )
  department: Department;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @Field(() => [Topic])
  @OneToMany(() => Topic, (topic) => topic.course)
  topicsUnderThisCourse: Topic[];

  @Field(() => [QuestionCourseTopic])
  @OneToMany(
    () => QuestionCourseTopic,
    (questionCourseTopic) => questionCourseTopic.course,
  )
  questionTopicRecordsForThisCourse: QuestionCourseTopic[];

  @Field(() => [RandomTest])
  @OneToMany(() => RandomTest, (randomTest) => randomTest.course)
  randomTestsUnderThisCourse: RandomTest[];

  @Field(() => [QuizSession])
  @OneToMany(() => QuizSession, (quizSession) => quizSession.course)
  quizSessionsUnderThisCourse: QuizSession[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
    this.name = this.name.toUpperCase();
  }
}
