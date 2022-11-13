import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StatusType } from '@utils/types/utils.types';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Question } from './question.entity';
import { QuizSession } from './quiz-session.entity';

@ObjectType('QUIZ_SESSION_DETAIL')
@Entity('QUIZ_SESSION_DETAIL')
export class QuizSessionDetail extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quizSessionId: string;

  @Field(() => QuizSession)
  @JoinColumn({ name: 'quizSessionId' })
  @ManyToOne(
    () => QuizSession,
    (quizSession) => quizSession.detailsForThisQuizSession,
  )
  quizSession: QuizSession;

  @Column({ type: 'uuid' })
  questionId: string;

  @Field(() => Question)
  @JoinColumn({ name: 'questionId' })
  @ManyToOne(
    () => Question,
    (question) => question.quizSessionDetailsForThisQuestion,
  )
  question: Question;

  @Field(() => StatusType)
  @Column({ type: 'enum', enum: StatusType })
  result: StatusType;

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
