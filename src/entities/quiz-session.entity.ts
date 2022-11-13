import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { generateUniqueKey } from '@utils/functions/utils.function';
import { TestType } from '@utils/types/utils.types';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Course } from './course.entity';
import { QuizSessionDetail } from './quiz-session-detail.entity';
import { RandomTestQuizRecord } from './random-test-quiz-record.entity';
import { User } from './user.entity';

@ObjectType('QUIZ_SESSION')
@Entity('QUIZ_SESSION')
export class QuizSession extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 5 })
  sessionKey: string;

  @Column({ type: 'uuid', nullable: true })
  courseId: string;

  @Field(() => Course)
  @JoinColumn({ name: 'courseId' })
  @ManyToOne(() => Course, (course) => course.quizSessionsUnderThisCourse)
  course: Course;

  @Column({ type: 'uuid' })
  userId: string;

  @Field(() => User)
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.quizSessionsForThisUser)
  user: User;

  @Field(() => Int)
  @Column({ type: 'float', default: 0.0 })
  totalPointsObtained: number;

  @Field(() => TestType)
  @Column({ type: 'enum', enum: TestType })
  testType: TestType;

  @Field()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Field()
  @CreateDateColumn()
  dateCreated: Date;

  @Field()
  @UpdateDateColumn()
  dateUpdated: Date;

  @Field(() => [QuizSessionDetail])
  @OneToMany(
    () => QuizSessionDetail,
    (quizSessionDetail) => quizSessionDetail.quizSession,
  )
  detailsForThisQuizSession: QuizSessionDetail[];

  @Field(() => [RandomTestQuizRecord])
  @OneToMany(
    () => RandomTestQuizRecord,
    (randomTestQuizRecord) => randomTestQuizRecord.quizSession,
  )
  randomTestsForThisQuizSession: RandomTestQuizRecord[];

  @BeforeInsert()
  beforeInsertHandler(): void {
    this.id = uuidv4();
    this.sessionKey = generateUniqueKey(5);
  }
}
