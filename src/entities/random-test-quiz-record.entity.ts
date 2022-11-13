import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { QuizSession } from './quiz-session.entity';
import { RandomTest } from './random-test.entity';
import { User } from './user.entity';

@ObjectType('RANDOM_TEST_QUIZ_RECORD')
@Entity('RANDOM_TEST_QUIZ_RECORD')
export class RandomTestQuizRecord extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Field(() => User)
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.randomTestsTakenByThisUser)
  user: User;

  @Column({ type: 'uuid' })
  quizSessionId: string;

  @Field(() => QuizSession)
  @JoinColumn({ name: 'quizSessionId' })
  @ManyToOne(
    () => QuizSession,
    (quizSession) => quizSession.randomTestsForThisQuizSession,
  )
  quizSession: QuizSession;

  @Column({ type: 'uuid' })
  randomTestId: string;

  @Field(() => RandomTest)
  @JoinColumn({ name: 'randomTestId' })
  @ManyToOne(
    () => RandomTest,
    (randomTest) => randomTest.testRecordsForThisRandomTest,
  )
  randomTest: RandomTest;

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
